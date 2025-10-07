// pages/api/admin/companies.ts
import pool from '../../../lib/neon-db';
import type { NextApiRequest, NextApiResponse } from 'next';

interface Company {
  company_id: number;
  company_name: string;
  address_street?: string;
  address_city?: string;
  address_state?: string;
  address_zip?: string;
  address_country?: string;
  phone?: string;
  email?: string;
  website?: string;
  industry?: string;
  main_contact_id?: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

interface AdminCompaniesResponse {
  success: boolean;
  companies?: Company[];
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AdminCompaniesResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Fetch all companies
    const companiesResult = await pool.query(
      `SELECT company_id, company_name, address_street, address_city, address_state,
              address_zip, address_country, phone, email, website, industry,
              main_contact_id, is_active, created_at, updated_at
       FROM companydb ORDER BY company_id`
    );

    const companies: Company[] = companiesResult.rows.map(company => ({
      company_id: company.company_id,
      company_name: company.company_name,
      address_street: company.address_street,
      address_city: company.address_city,
      address_state: company.address_state,
      address_zip: company.address_zip,
      address_country: company.address_country,
      phone: company.phone,
      email: company.email,
      website: company.website,
      industry: company.industry,
      main_contact_id: company.main_contact_id,
      is_active: company.is_active,
      created_at: company.created_at,
      updated_at: company.updated_at
    }));

    res.status(200).json({
      success: true,
      companies: companies
    });

  } catch (error) {
    console.error('Admin companies fetch error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
