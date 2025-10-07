// pages/api/admin/update-company.ts
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

interface UpdateCompanyRequest {
  company_id: number;
  company_name?: string;
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
  is_active?: boolean;
}

interface UpdateCompanyResponse {
  success: boolean;
  company?: Company;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UpdateCompanyResponse>
) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const {
    company_id,
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
  }: UpdateCompanyRequest = req.body;

  if (!company_id) {
    return res.status(400).json({ success: false, error: 'Company ID is required' });
  }

  try {
    // Check if company exists
    const existingCompany = await pool.query(
      'SELECT company_id FROM companydb WHERE company_id = $1',
      [company_id]
    );

    if (existingCompany.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Company not found' });
    }

    // If updating company_name, check for duplicates
    if (company_name) {
      const duplicateCheck = await pool.query(
        'SELECT company_id FROM companydb WHERE company_name = $1 AND company_id != $2',
        [company_name.trim(), company_id]
      );

      if (duplicateCheck.rows.length > 0) {
        return res.status(400).json({ success: false, error: 'Company name already exists' });
      }
    }

    // Build dynamic update query
    const updateFields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (company_name !== undefined) {
      updateFields.push(`company_name = $${paramIndex++}`);
      values.push(company_name.trim());
    }
    if (address_street !== undefined) {
      updateFields.push(`address_street = $${paramIndex++}`);
      values.push(address_street?.trim() || null);
    }
    if (address_city !== undefined) {
      updateFields.push(`address_city = $${paramIndex++}`);
      values.push(address_city?.trim() || null);
    }
    if (address_state !== undefined) {
      updateFields.push(`address_state = $${paramIndex++}`);
      values.push(address_state?.trim() || null);
    }
    if (address_zip !== undefined) {
      updateFields.push(`address_zip = $${paramIndex++}`);
      values.push(address_zip?.trim() || null);
    }
    if (address_country !== undefined) {
      updateFields.push(`address_country = $${paramIndex++}`);
      values.push(address_country?.trim() || 'USA');
    }
    if (phone !== undefined) {
      updateFields.push(`phone = $${paramIndex++}`);
      values.push(phone?.trim() || null);
    }
    if (email !== undefined) {
      updateFields.push(`email = $${paramIndex++}`);
      values.push(email?.trim() || null);
    }
    if (website !== undefined) {
      updateFields.push(`website = $${paramIndex++}`);
      values.push(website?.trim() || null);
    }
    if (industry !== undefined) {
      updateFields.push(`industry = $${paramIndex++}`);
      values.push(industry?.trim() || null);
    }
    if (main_contact_id !== undefined) {
      updateFields.push(`main_contact_id = $${paramIndex++}`);
      values.push(main_contact_id || null);
    }
    if (is_active !== undefined) {
      updateFields.push(`is_active = $${paramIndex++}`);
      values.push(is_active);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ success: false, error: 'No fields to update' });
    }

    // Add company_id as the last parameter
    values.push(company_id);

    const updateQuery = `
      UPDATE companydb
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE company_id = $${paramIndex}
      RETURNING *
    `;

    const updateResult = await pool.query(updateQuery, values);

    const updatedCompany: Company = {
      company_id: updateResult.rows[0].company_id,
      company_name: updateResult.rows[0].company_name,
      address_street: updateResult.rows[0].address_street,
      address_city: updateResult.rows[0].address_city,
      address_state: updateResult.rows[0].address_state,
      address_zip: updateResult.rows[0].address_zip,
      address_country: updateResult.rows[0].address_country,
      phone: updateResult.rows[0].phone,
      email: updateResult.rows[0].email,
      website: updateResult.rows[0].website,
      industry: updateResult.rows[0].industry,
      main_contact_id: updateResult.rows[0].main_contact_id,
      is_active: updateResult.rows[0].is_active,
      created_at: updateResult.rows[0].created_at,
      updated_at: updateResult.rows[0].updated_at
    };

    res.status(200).json({
      success: true,
      company: updatedCompany
    });

  } catch (error) {
    console.error('Update company error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
