// pages/api/wixData.ts

import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Extract data from the request body
    const data = req.body;

    console.log(data);

    // Send a response back
    res.status(200).json({ message: 'Data received', data });
  } else {
    // Handle unsupported request methods
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
