// scripts/add-startrek-companies.ts
const pool = require('../lib/neon-db');

async function addStarTrekCompanies() {
  try {
    const companies = [
      {
        company_name: 'Starfleet Command',
        address_street: '1 Starfleet Drive',
        address_city: 'San Francisco',
        address_state: 'CA',
        address_zip: '94133',
        address_country: 'USA',
        phone: '(415) 555-0101',
        email: 'command@starfleet.ufp',
        website: 'https://starfleet.ufp',
        industry: 'Space Exploration & Defense',
        main_contact_id: null,
        is_active: true
      },
      {
        company_name: 'United Federation of Planets',
        address_street: '2271 Federation Plaza',
        address_city: 'Paris',
        address_state: 'Ile-de-France',
        address_zip: '75001',
        address_country: 'France',
        phone: '+33-1-555-0102',
        email: 'council@federation.ufp',
        website: 'https://federation.ufp',
        industry: 'Intergalactic Government',
        main_contact_id: null,
        is_active: true
      },
      {
        company_name: 'Vulcan Science Academy',
        address_street: '1 Logic Boulevard',
        address_city: 'Shi\'Kahr',
        address_state: 'Vulcan',
        address_zip: '00001',
        address_country: 'Vulcan',
        phone: '+1-555-0103',
        email: 'academy@vulcan.science',
        website: 'https://vulcan.science',
        industry: 'Scientific Research & Education',
        main_contact_id: null,
        is_active: true
      },
      {
        company_name: 'Klingon Defense Force',
        address_street: '1 Warrior Way',
        address_city: 'Qo\'noS',
        address_state: 'Klingon Empire',
        address_zip: '00002',
        address_country: 'Klingon Empire',
        phone: '+1-555-0104',
        email: 'defense@klingon.empire',
        website: 'https://klingon.empire',
        industry: 'Military Defense & Security',
        main_contact_id: null,
        is_active: true
      },
      {
        company_name: 'Ferengi Alliance',
        address_street: '1 Commerce Street',
        address_city: 'Ferenginar',
        address_state: 'Ferengi Alliance',
        address_zip: '00003',
        address_country: 'Ferengi Alliance',
        phone: '+1-555-0105',
        email: 'commerce@ferengi.alliance',
        website: 'https://ferengi.alliance',
        industry: 'Commerce & Trade',
        main_contact_id: null,
        is_active: true
      }
    ];

    for (const company of companies) {
      // Insert company
      const result = await pool.query(`
        INSERT INTO companydb (
          company_name, address_street, address_city, address_state, address_zip,
          address_country, phone, email, website, industry, main_contact_id, is_active
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
        )
        RETURNING company_id, company_name, industry
      `, [
        company.company_name,
        company.address_street,
        company.address_city,
        company.address_state,
        company.address_zip,
        company.address_country,
        company.phone,
        company.email,
        company.website,
        company.industry,
        company.main_contact_id,
        company.is_active
      ]);

      console.log(`✅ Company created: ${company.company_name}`);
      console.log('Details:', result.rows[0]);
      console.log('---');
    }

    console.log('\n🎉 All Star Trek companies created successfully!');
    console.log('\n📋 Company list:');
    companies.forEach((company, index) => {
      console.log(`${index + 1}. ${company.company_name} - ${company.industry}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating companies:', error);
    process.exit(1);
  }
}

addStarTrekCompanies();
