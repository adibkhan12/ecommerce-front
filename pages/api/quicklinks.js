
import {mongooseConnect} from "@/lib/mongoose";
import {QuickLinks} from "@/models/QuickLinks";

export default async function handler(req, res) {
  try {
    // Establish a connection to the database
    await mongooseConnect();

    const quicklinks = await QuickLinks.findOne();
    
    if (!quicklinks) {
      return res.status(404).json({ error: 'QuickLinks data not found' });
    }

    // Extract description fields for each link
    res.json({
      about: quicklinks.about.description,
      terms: quicklinks.terms.description,
      shop: quicklinks.shop.description,
      support: quicklinks.support.description,
    });
  } catch (error) {
    console.error('Error fetching quicklinks data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
