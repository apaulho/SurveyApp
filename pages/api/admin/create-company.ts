// pages/api/admin/create-company.ts
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

interface CreateCompanyRequest {
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
}

interface CreateCompanyResponse {
  success: boolean;
  company?: Company;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CreateCompanyResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const {
    company_name,
    address_street,
    address_city,
    address_state,
    address_zip,
    address_country,
    phone,
    email,
    website,
    industry,
    main_contact_id,
    is_active
  }: CreateCompanyRequest = req.body;

  // Validate required fields
  if (!company_name || company_name.trim() === '') {
    return res.status(400).json({ success: false, error: 'Company name is required' });
  }

  try {
    // Check if company name already exists
    const existingCompany = await pool.query(
      'SELECT company_id FROM companydb WHERE company_name = $1',
      [company_name.trim()]
    );

    if (existingCompany.rows.length > 0) {
      return res.status(400).json({ success: false, error: 'Company name already exists' });
    }

    // Insert new company
    const insertResult = await pool.query(
      `INSERT INTO companydb (
        company_name, address_street, address_city, address_state, address_zip,
        address_country, phone, email, website, industry, main_contact_id, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *`,
      [
        company_name.trim(),
        address_street?.trim() || null,
        address_city?.trim() || null,
        address_state?.trim() || null,
        address_zip?.trim() || null,
        address_country?.trim() || 'USA',
        phone?.trim() || null,
        email?.trim() || null,
        website?.trim() || null,
        industry?.trim() || null,
        main_contact_id || null,
        is_active !== undefined ? is_active : true
      ]
    );

    const newCompany: Company = {
      company_id: insertResult.rows[0].company_id,
      company_name: insertResult.rows[0].company_name,
      address_street: insertResult.rows[0].address_street,
      address_city: insertResult.rows[0].address_city,
      address_state: insertResult.rows[0].address_state,
      address_zip: insertResult.rows[0].address_zip,
      address_country: insertResult.rows[0].address_country,
      phone: insertResult.rows[0].phone,
      email: insertResult.rows[0].email,
      website: insertResult.rows[0].website,
      industry: insertResult.rows[0].industry,
      main_contact_id: insertResult.rows[0].main_contact_id,
      is_active: insertResult.rows[0].is_active,
      created_at: insertResult.rows[0].created_at,
      updated_at: insertResult.rows[0].updated_at
    };

    res.status(201).json({
      success: true,
      company: newCompany
    });

  } catch (error) {
    console.error('Create company error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
