// pages/api/admin/update-question.ts
import pool from '../../../lib/neon-db';
import type { NextApiRequest, NextApiResponse } from 'next';

interface Question {
  question_id: number;
  question_text: string;
  question_type: string;
  category?: string | null;
  company_id?: number | null;
  created_by_user_id?: number | null;
  created_at?: string;
  updated_at?: string;
  is_active: boolean;
}

interface UpdateQuestionRequest {
  question_id: number;
  question_text?: string;
  question_type?: string;
  category?: string | null;
  is_active?: boolean;
}

interface UpdateQuestionResponse {
  success: boolean;
  question?: Question;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UpdateQuestionResponse>
) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  console.log('Update question request received');
  console.log('Method:', req.method);
  console.log('Body:', JSON.stringify(req.body, null, 2));

  const {
    question_id,
    question_text,
    question_type,
    category,
    is_active
  }: UpdateQuestionRequest = req.body;

  if (!question_id) {
    return res.status(400).json({ success: false, error: 'Question ID is required' });
  }

  try {
    console.log('Testing database connection...');
    
    // Test database connection first
    if (!pool) {
      console.error('Database pool is undefined');
      return res.status(500).json({ success: false, error: 'Database connection not available' });
    }

    // Test with a simple query
    try {
      const testQuery = await pool.query('SELECT 1 as test');
      console.log('Database connection test successful:', testQuery.rows);
    } catch (dbError) {
      console.error('Database connection test failed:', dbError);
      return res.status(500).json({ 
        success: false, 
        error: `Database connection failed: ${dbError instanceof Error ? dbError.message : 'Unknown error'}` 
      });
    }

    // Check if question exists
    const existingQuestion = await pool.query(
      'SELECT question_id FROM questiondb WHERE question_id = $1',
      [question_id]
    );

    console.log('Question existence check result:', existingQuestion.rows);

    if (existingQuestion.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Question not found' });
    }

    // Build dynamic update query
    const updateFields: string[] = [];
    const updateValues: any[] = [];
    let paramCounter = 1;

    if (question_text !== undefined) {
      updateFields.push(`question_text = $${paramCounter}`);
      updateValues.push(question_text);
      paramCounter++;
    }

    if (question_type !== undefined) {
      updateFields.push(`question_type = $${paramCounter}`);
      updateValues.push(question_type);
      paramCounter++;
    }

    if (category !== undefined) {
      updateFields.push(`category = $${paramCounter}`);
      updateValues.push(category);
      paramCounter++;
    }

    if (is_active !== undefined) {
      updateFields.push(`is_active = $${paramCounter}`);
      updateValues.push(is_active);
      paramCounter++;
    }

    // Always update the updated_at field
    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);

    if (updateFields.length === 1) { // Only updated_at was added
      return res.status(400).json({ success: false, error: 'No fields to update' });
    }

    // Add question_id for WHERE clause
    updateValues.push(question_id);

    const updateQuery = `
      UPDATE questiondb 
      SET ${updateFields.join(', ')}
      WHERE question_id = $${paramCounter}
      RETURNING question_id, question_text, question_type, category, company_id, created_by_user_id, created_at, updated_at, is_active
    `;

    console.log('Executing update query:', updateQuery);
    console.log('With values:', updateValues);

    let updateResult;
    try {
      updateResult = await pool.query(updateQuery, updateValues);
      console.log('Question update result:', updateResult.rows);
    } catch (updateError) {
      console.error('Error during question update:', updateError);
      throw updateError;
    }

    const updatedQuestion: Question = {
      question_id: updateResult.rows[0].question_id,
      question_text: updateResult.rows[0].question_text,
      question_type: updateResult.rows[0].question_type,
      category: updateResult.rows[0].category,
      company_id: updateResult.rows[0].company_id,
      created_by_user_id: updateResult.rows[0].created_by_user_id,
      created_at: updateResult.rows[0].created_at,
      updated_at: updateResult.rows[0].updated_at,
      is_active: updateResult.rows[0].is_active
    };

    console.log('Question update completed successfully');

    res.status(200).json({
      success: true,
      question: updatedQuestion
    });

  } catch (error) {
    console.error('Update question error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('Error name:', error instanceof Error ? error.name : 'Unknown error type');
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    
    let errorMessage = 'Failed to update question';
    if (error instanceof Error) {
      errorMessage += `: ${error.message}`;
    } else {
      errorMessage += `: ${String(error)}`;
    }
    
    return res.status(500).json({ 
      success: false, 
      error: errorMessage 
    });
  }
}
