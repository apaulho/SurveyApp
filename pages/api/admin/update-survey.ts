// pages/api/admin/update-survey.ts
import pool from '../../../lib/neon-db';
import type { NextApiRequest, NextApiResponse } from 'next';

interface Survey {
  survey_id: number;
  survey_title: string;
  survey_description?: string;
  company_id?: number;
  created_by_user_id: number;
  is_active: boolean;
  is_public: boolean;
  allow_anonymous: boolean;
  start_date?: string;
  end_date?: string;
  created_at?: string;
  updated_at?: string;
}

interface UpdateSurveyRequest {
  survey_id: number;
  survey_title?: string;
  survey_description?: string;
  company_id?: number;
  is_active?: boolean;
  is_public?: boolean;
  allow_anonymous?: boolean;
  start_date?: string;
  end_date?: string;
  question_ids?: number[]; // Array of question IDs to include in the survey
}

interface UpdateSurveyResponse {
  success: boolean;
  survey?: Survey;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UpdateSurveyResponse>
) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  console.log('Update survey request received');
  console.log('Method:', req.method);
  console.log('Body keys:', Object.keys(req.body));
  console.log('Full body:', JSON.stringify(req.body, null, 2));

  const {
    survey_id,
    survey_title,
    survey_description,
    company_id,
    is_active,
    is_public,
    allow_anonymous,
    start_date,
    end_date,
    question_ids
  }: UpdateSurveyRequest = req.body;

  console.log('Parsed data:', {
    survey_id,
    survey_title,
    survey_description,
    company_id,
    is_active,
    is_public,
    allow_anonymous,
    start_date,
    end_date,
    question_ids,
    question_ids_type: typeof question_ids,
    question_ids_isArray: Array.isArray(question_ids),
    question_ids_length: question_ids?.length
  });

  if (!survey_id) {
    return res.status(400).json({ success: false, error: 'Survey ID is required' });
  }

  try {
    console.log('Testing database connection...');
    // Test database connection
    await pool.query('SELECT 1');
    console.log('Database connection successful');

    // Check if survey exists
    const existingSurvey = await pool.query(
      'SELECT survey_id FROM surveydb WHERE survey_id = $1',
      [survey_id]
    );

    console.log('Survey existence check result:', existingSurvey.rows);

    if (existingSurvey.rows.length === 0) {
      console.error('Survey not found with ID:', survey_id);
      return res.status(404).json({ success: false, error: `Survey with ID ${survey_id} not found` });
    }

    console.log('Survey exists, proceeding with update...');

    // Build dynamic update query
    let updateResult;
    try {
      const updateFields: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (survey_title !== undefined) {
        updateFields.push(`survey_title = $${paramIndex++}`);
        values.push(survey_title.trim());
      }
      if (survey_description !== undefined) {
        updateFields.push(`survey_description = $${paramIndex++}`);
        values.push(survey_description?.trim() || null);
      }
      if (company_id !== undefined) {
        updateFields.push(`company_id = $${paramIndex++}`);
        values.push(company_id || null);
      }
      if (is_active !== undefined) {
        updateFields.push(`is_active = $${paramIndex++}`);
        values.push(is_active);
      }
      if (is_public !== undefined) {
        updateFields.push(`is_public = $${paramIndex++}`);
        values.push(is_public);
      }
      if (allow_anonymous !== undefined) {
        updateFields.push(`allow_anonymous = $${paramIndex++}`);
        values.push(allow_anonymous);
      }
      if (start_date !== undefined) {
        updateFields.push(`start_date = $${paramIndex++}`);
        values.push(start_date || null);
      }
      if (end_date !== undefined) {
        updateFields.push(`end_date = $${paramIndex++}`);
        values.push(end_date || null);
      }

      console.log('Update fields:', updateFields);
      console.log('Update values:', values);

      if (updateFields.length > 0) {
        // Add survey_id as the last parameter
        values.push(survey_id);

        const updateQuery = `
          UPDATE surveydb
          SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
          WHERE survey_id = $${paramIndex}
          RETURNING *
        `;

        console.log('Executing update query:', updateQuery);
        console.log('With parameters:', values);

        updateResult = await pool.query(updateQuery, values);
      } else {
        // Just fetch the current survey if no updates
        console.log('No fields to update, fetching current survey');
        updateResult = await pool.query(
          'SELECT * FROM surveydb WHERE survey_id = $1',
          [survey_id]
        );
      }

      console.log('Update result:', updateResult.rows[0]);

    } catch (updateError) {
      console.error('Error during survey update:', updateError);
      throw updateError;
    }

    const updatedSurvey: Survey = {
      survey_id: updateResult.rows[0].survey_id,
      survey_title: updateResult.rows[0].survey_title,
      survey_description: updateResult.rows[0].survey_description,
      company_id: updateResult.rows[0].company_id,
      created_by_user_id: updateResult.rows[0].created_by_user_id,
      is_active: updateResult.rows[0].is_active,
      is_public: updateResult.rows[0].is_public,
      allow_anonymous: updateResult.rows[0].allow_anonymous,
      start_date: updateResult.rows[0].start_date,
      end_date: updateResult.rows[0].end_date,
      created_at: updateResult.rows[0].created_at,
      updated_at: updateResult.rows[0].updated_at
    };

    // If question_ids were provided, update the survey questions
    if (question_ids !== undefined) {
      console.log('About to process question_ids:', question_ids);

      // Handle empty array case
      if (question_ids.length === 0) {
        console.log('No questions selected, deleting all existing questions for survey', survey_id);
        await pool.query(
          'DELETE FROM surveyquestiondb WHERE survey_id = $1',
          [survey_id]
        );
        console.log('Successfully removed all questions from survey', survey_id);
      } else {
        console.log('Processing non-empty question_ids array');

        // Validate question_ids
        if (!Array.isArray(question_ids)) {
          console.error('question_ids is not an array:', question_ids);
          throw new Error('question_ids must be an array');
        }

        console.log('question_ids is an array, validating individual items...');

        // Validate that all question_ids are numbers
        for (const qid of question_ids) {
          console.log('Checking question_id:', qid, 'type:', typeof qid, 'isNaN:', isNaN(qid));
          if (typeof qid !== 'number' || isNaN(qid)) {
            throw new Error(`Invalid question_id: ${qid} (type: ${typeof qid})`);
          }
        }

        console.log('All question_ids are valid numbers, checking database existence...');

        // Check if questions exist in database - check each one individually
        console.log('Checking question existence individually...');
        for (const qid of question_ids) {
          const singleCheck = await pool.query(
            'SELECT question_id FROM questiondb WHERE question_id = $1',
            [qid]
          );
          if (singleCheck.rows.length === 0) {
            console.error(`Question ${qid} not found in database`);
            throw new Error(`Question not found in database: ${qid}`);
          }
        }
        console.log('All questions verified to exist in database');

        // First, remove existing questions
        await pool.query(
          'DELETE FROM surveyquestiondb WHERE survey_id = $1',
          [survey_id]
        );

        // Then add the new questions
        for (let i = 0; i < question_ids.length; i++) {
          console.log(`Inserting question ${question_ids[i]} at position ${i} for survey ${survey_id}`);
          await pool.query(
            'INSERT INTO surveyquestiondb (survey_id, question_id, sort_order, is_required) VALUES ($1, $2, $3, false)',
            [survey_id, question_ids[i], i]
          );
        }
        console.log(`Successfully inserted ${question_ids.length} questions for survey ${survey_id}`);
      }
    } else {
      console.log('question_ids is undefined, skipping question updates');
    }

    res.status(200).json({
      success: true,
      survey: updatedSurvey
    });

  } catch (error) {
    console.error('Update survey error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ success: false, error: `Internal server error: ${errorMessage}` });
  }
}
