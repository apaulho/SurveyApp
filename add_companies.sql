-- Add Companies to Neon DB for Survey Application Testing and Demo Purposes
-- These companies represent potential clients who might use survey software

-- Technology Company 1
INSERT INTO companydb (
  company_name, address_street, address_city, address_state, address_zip,
  address_country, phone, email, website, industry, main_contact_id, is_active
) VALUES (
  'TechCorp Solutions',
  '100 Silicon Valley Blvd',
  'San Jose',
  'CA',
  '95113',
  'USA',
  '(408) 555-0101',
  'info@techcorp.com',
  'https://www.techcorp.com',
  'Software Development',
  NULL,
  true
);

-- Marketing Agency
INSERT INTO companydb (
  company_name, address_street, address_city, address_state, address_zip,
  address_country, phone, email, website, industry, main_contact_id, is_active
) VALUES (
  'MarketPulse Analytics',
  '250 Madison Avenue',
  'New York',
  'NY',
  '10016',
  'USA',
  '(212) 555-0202',
  'contact@marketpulse.com',
  'https://www.marketpulse.com',
  'Market Research',
  NULL,
  true
);

-- Healthcare Provider
INSERT INTO companydb (
  company_name, address_street, address_city, address_state, address_zip,
  address_country, phone, email, website, industry, main_contact_id, is_active
) VALUES (
  'MediCare Systems',
  '500 Healthcare Drive',
  'Boston',
  'MA',
  '02115',
  'USA',
  '(617) 555-0303',
  'admin@medicare.com',
  'https://www.medicare.com',
  'Healthcare',
  NULL,
  true
);

-- Educational Institution
INSERT INTO companydb (
  company_name, address_street, address_city, address_state, address_zip,
  address_country, phone, email, website, industry, main_contact_id, is_active
) VALUES (
  'University Research Center',
  '123 Academic Way',
  'Austin',
  'TX',
  '78712',
  'USA',
  '(512) 555-0404',
  'research@university.edu',
  'https://research.university.edu',
  'Education',
  NULL,
  true
);

-- Retail Corporation
INSERT INTO companydb (
  company_name, address_street, address_city, address_state, address_zip,
  address_country, phone, email, website, industry, main_contact_id, is_active
) VALUES (
  'RetailMax Corporation',
  '789 Commerce Street',
  'Chicago',
  'IL',
  '60601',
  'USA',
  '(312) 555-0505',
  'surveys@retailmax.com',
  'https://www.retailmax.com',
  'Retail',
  NULL,
  true
);

-- Financial Services
INSERT INTO companydb (
  company_name, address_street, address_city, address_state, address_zip,
  address_country, phone, email, website, industry, main_contact_id, is_active
) VALUES (
  'FinanceFirst Bank',
  '1000 Wall Street',
  'New York',
  'NY',
  '10005',
  'USA',
  '(212) 555-0606',
  'customer.feedback@financefirst.com',
  'https://www.financefirst.com',
  'Financial Services',
  NULL,
  true
);

-- Manufacturing Company
INSERT INTO companydb (
  company_name, address_street, address_city, address_state, address_zip,
  address_country, phone, email, website, industry, main_contact_id, is_active
) VALUES (
  'IndusTech Manufacturing',
  '1500 Industrial Parkway',
  'Detroit',
  'MI',
  '48201',
  'USA',
  '(313) 555-0707',
  'hr@industech.com',
  'https://www.industech.com',
  'Manufacturing',
  NULL,
  true
);

-- Non-Profit Organization
INSERT INTO companydb (
  company_name, address_street, address_city, address_state, address_zip,
  address_country, phone, email, website, industry, main_contact_id, is_active
) VALUES (
  'Community Impact Foundation',
  '75 Civic Center Drive',
  'Seattle',
  'WA',
  '98101',
  'USA',
  '(206) 555-0808',
  'surveys@communityimpact.org',
  'https://www.communityimpact.org',
  'Non-Profit',
  NULL,
  true
);

-- Government Agency
INSERT INTO companydb (
  company_name, address_street, address_city, address_state, address_zip,
  address_country, phone, email, website, industry, main_contact_id, is_active
) VALUES (
  'City Planning Department',
  '200 Government Plaza',
  'Denver',
  'CO',
  '80202',
  'USA',
  '(303) 555-0909',
  'public.engagement@cityplanning.gov',
  'https://www.cityplanning.gov',
  'Government',
  NULL,
  true
);

-- Consulting Firm
INSERT INTO companydb (
  company_name, address_street, address_city, address_state, address_zip,
  address_country, phone, email, website, industry, main_contact_id, is_active
) VALUES (
  'Strategic Advisors LLC',
  '300 Consulting Lane',
  'Atlanta',
  'GA',
  '30303',
  'USA',
  '(404) 555-1010',
  'projects@strategicadvisors.com',
  'https://www.strategicadvisors.com',
  'Consulting',
  NULL,
  true
);
