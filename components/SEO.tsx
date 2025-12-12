import React from 'react';
import { useSite } from '../context/SiteContext';

interface SEOProps {
  title?: string;
  description?: string;
  type?: 'website' | 'article' | 'profile';
  image?: string;
  schema?: Record<string, any>;
}

const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  type = 'website', 
  image,
  schema 
}) => {
  const { general } = useSite();
  
  const siteName = general.siteName || 'Herbal Wisdom';
  const finalTitle = title ? `${title} | ${siteName}` : siteName;
  const finalDescription = description || general.aboutShort || 'מרכז ידע וטיפול בצמחי מרפא';
  const finalImage = image || 'https://picsum.photos/seed/herbal_default/1200/630'; // Default social image

  // Base Schema for Local Business / Professional
  const baseSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness", // Or "Physician" / "MedicalOrganization" depending on strictness
    "name": general.siteName,
    "image": finalImage,
    "telephone": general.phone,
    "email": general.email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": general.address
    },
    "founder": {
      "@type": "Person",
      "name": general.therapistName
    },
    "description": general.aboutShort
  };

  return (
    <>
      {/* Standard Meta Tags - React 19 hoists these to head automatically */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="he_IL" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalImage} />

      {/* Structured Data (JSON-LD) for Google/Gemini/GPT */}
      <script type="application/ld+json">
        {JSON.stringify(schema ? { ...baseSchema, ...schema } : baseSchema)}
      </script>
    </>
  );
};

export default SEO;