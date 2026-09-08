import { Request, Response } from 'express';
import { ReelModel } from '../models/index';

export const getReels = async (req: Request, res: Response): Promise<void> => {
  try {
    const { featured, all } = req.query;
    let list = await ReelModel.find();

    if (all !== 'true') {
      list = list.filter(r => r.published !== false);
    }

    if (featured === 'true') {
      list = list.filter(r => r.featured === true);
    }

    list.sort((a, b) => (a.order || 0) - (b.order || 0));

    res.json({ success: true, count: list.length, reels: list });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve reels.' });
  }
};

export const createReel = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      title,
      description,
      eventName,
      city,
      venue,
      eventDate,
      thumbnail,
      videoUrl,
      instagramUrl,
      views,
      featured,
      published,
      order,
    } = req.body;

    if (!title || !eventName || !city || !thumbnail) {
      res.status(400).json({
        success: false,
        message: 'Reel title, event name, city, and thumbnail are required.',
      });
      return;
    }

    const reel = await ReelModel.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      eventName: eventName.trim(),
      city: city.trim(),
      venue: venue ? venue.trim() : 'Private Venue',
      eventDate: eventDate || new Date().toISOString().split('T')[0],
      thumbnail: thumbnail.trim(),
      videoUrl: videoUrl ? videoUrl.trim() : '',
      instagramUrl: instagramUrl ? instagramUrl.trim() : 'https://www.instagram.com/leox_shoots/',
      views: views || '25K+',
      featured: Boolean(featured),
      published: published !== undefined ? Boolean(published) : true,
      order: Number(order) || 0,
    });

    res.status(201).json({ success: true, message: 'Reel created successfully.', reel });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create reel.' });
  }
};

export const updateReel = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updated = await ReelModel.findByIdAndUpdate(id, req.body);
    if (!updated) {
      res.status(404).json({ success: false, message: 'Reel not found.' });
      return;
    }
    res.json({ success: true, message: 'Reel updated successfully.', reel: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update reel.' });
  }
};

export const deleteReel = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await ReelModel.findByIdAndDelete(id);
    if (!deleted) {
      res.status(404).json({ success: false, message: 'Reel not found.' });
      return;
    }
    res.json({ success: true, message: 'Reel deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete reel.' });
  }
};
