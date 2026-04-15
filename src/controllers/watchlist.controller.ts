import { type Request, type Response } from "express";
import { prisma } from "../db.js";
import { WatchlistStatus } from "../generated/prisma/index.js";

type RequestWatchlist = {
  movieId: string;
  status: WatchlistStatus;
  rating: number;
  notes: string;
};

type UpdateData = {
  status: string;
  rating: number;
  notes: string;
};

export const addToWatchlist = async (
  req: Request<{}, {}, RequestWatchlist>,
  res: Response,
) => {
  const { movieId, status, notes, rating } = req.body;

  //verify movie exists
  const movie = await prisma.movie.findUnique({
    where: { id: movieId },
  });

  if (!movie) {
    return res.status(404).json({
      error: "Movie not found.",
    });
  }

  const existingInWatchlist = await prisma.watchlistItem.findUnique({
    where: {
      userId_movieId: {
        userId: req.user?.id,
        movieId: movieId,
      },
    },
  });

  if (existingInWatchlist) {
    return res.status(404).json({
      error: "Movie already in the watchlist.",
    });
  }

  const watchlistItem = await prisma.watchlistItem.create({
    data: {
      userId: req.user?.id,
      movieId,
      status: status || "PLANNED",
      rating,
      notes,
    },
  });

  res.status(201).json({
    status: "sucess",
    data: {
      watchlistItem,
    },
  });
};

export const updateWatchlistItem = async (req: Request, res: Response) => {
  const { status, rating, notes } = req.body;

  // Find watchlist item and verify ownership
  const watchlistItem = await prisma.watchlistItem.findUnique({
    where: { id: req.params.id },
  });

  if (!watchlistItem) {
    return res.status(404).json({ error: "Watchlist item not found" });
  }

  // Ensure only owner can update
  if (watchlistItem.userId !== req.user?.id) {
    return res
      .status(403)
      .json({ error: "Not allowed to update this watchlist item" });
  }

  // Build update data
  const updateData: UpdateData = { status, notes, rating };
  if (status !== undefined) updateData.status = status.toUpperCase();
  if (rating !== undefined) updateData.rating = rating;
  if (notes !== undefined) updateData.notes = notes;

  // Update watchlist item
  const updatedItem = await prisma.watchlistItem.update({
    where: { id: req.params.id },
    data: updateData,
  });

  res.status(200).json({
    status: "success",
    data: {
      watchlistItem: updatedItem,
    },
  });
};

export const removeFromWatchlist = async (req: Request, res: Response) => {
  // Find watchlist item and verify ownership
  const watchlistItem = await prisma.watchlistItem.findUnique({
    where: { id: req.params.id },
  });

  if (!watchlistItem) {
    return res.status(404).json({ error: "Watchlist item not found" });
  }

  // Ensure only owner can delete
  if (watchlistItem.userId !== req.user?.id) {
    return res
      .status(403)
      .json({ error: "Not allowed to update this watchlist item" });
  }

  await prisma.watchlistItem.delete({
    where: { id: req.params.id },
  });

  res.status(200).json({
    status: "success",
    message: "Movie removed from watchlist",
  });
};
