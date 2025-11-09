/**
 * Fetch projects from Strapi API
 */

import { env } from '@/config/env';
import { getImageUrl } from './urls';

export type StrapiProject = {
  documentId: string;
  title: string;
  sub: string;
  desc: string;
  metric?: string;
  stack?: string[];
  done: string[];
  benefits: string[];
  outcome: string;
  gallery: string[]; // Array of image URLs
  mainImage?: string; // Main image URL
};

type GraphQLResponse = {
  data?: {
    projects: Array<{
      documentId: string;
      title: string;
      subtitle?: string;
      description?: string | any[]; // Can be string (HTML) or array (Blocks)
      metric?: string;
      stack?: string[] | null;
      done?: string[] | null;
      benefits?: string[] | null;
      outcome?: string;
      locale?: string;
      gallery?: Array<{
        url: string;
        alternativeText?: string;
      }>;
      mainImage?: {
        url: string;
      };
    }>;
  };
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: Array<string | number>;
  }>;
};

/**
 * Convert Rich Text (Blocks) to plain text
 * Strapi Rich Text (Blocks) returns an array of block objects
 */
function richTextToPlainText(richText: string | any[] | undefined): string {
  if (!richText) return '';
  
  // If it's already a string, treat as HTML
  if (typeof richText === 'string') {
    return richText
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .trim();
  }
  
  // If it's an array (Blocks format), extract text from blocks
  if (Array.isArray(richText)) {
    return richText
      .map((block: any) => {
        if (block.type === 'paragraph' && block.children) {
          return block.children
            .map((child: any) => {
              // Handle GraphQL Blocks structure: { type: "text", text: "..." }
              let text = child.text || child.children?.[0]?.text || '';
              // Skip if child.type is not "text" (might be formatting nodes)
              if (child.type && child.type !== 'text') {
                return '';
              }
              // If text contains HTML (like "<p>...</p>"), extract and clean it
              if (typeof text === 'string' && text.includes('<')) {
                text = text
                  .replace(/<[^>]*>/g, '')
                  .replace(/&nbsp;/g, ' ')
                  .replace(/&amp;/g, '&')
                  .replace(/&lt;/g, '<')
                  .replace(/&gt;/g, '>')
                  .replace(/&quot;/g, '"')
                  .trim();
              }
              return text;
            })
            .filter(Boolean)
            .join(' ');
        }
        return '';
      })
      .filter(Boolean)
      .join(' ')
      .trim();
  }
  
  return String(richText).trim();
}

/**
 * GraphQL query to fetch projects with locale support
 * Strapi GraphQL structure - uses documentId, not id/data wrapper
 */
const PROJECTS_QUERY = (locale: string = 'uk') => `
  query GetProjects {
    projects(locale: "${locale}") {
      documentId
      title
      subtitle
      description
      metric
      stack
      done
      benefits
      outcome
      locale
      gallery {
        url
        alternativeText
      }
      mainImage {
        url
      }
    }
  }
`;

/**
 * Fetch projects from Strapi using GraphQL with locale support
 * @param locale - Locale code ('uk' or 'en')
 */
export async function getProjects(locale: string = 'uk'): Promise<StrapiProject[]> {
  try {
    if (!env.API_URL) {
      console.warn('⚠️ API_URL is not set, returning empty projects');
      return [];
    }

    const graphqlUrl = `${env.API_URL}/graphql`;
    
    // Log in both dev and production for debugging
    console.log('🔍 Fetching projects from GraphQL:', graphqlUrl);
    console.log('🔍 Locale requested:', locale);
    console.log('🔍 API_URL:', env.API_URL);
    console.log('🔍 NODE_ENV:', process.env.NODE_ENV);

    const response = await fetch(graphqlUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: PROJECTS_QUERY(locale),
      }),
      next: { 
        // Disable cache to always get fresh data with correct locale
        revalidate: 0, // Always revalidate to get correct locale
      },
      cache: 'no-store', // Always fetch fresh data
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Failed to fetch projects:', response.status, response.statusText);
      console.error('URL:', graphqlUrl);
      console.error('Response:', errorText);
      
      // If 401, log helpful message about permissions
      if (response.status === 401) {
        console.warn('⚠️ 401 Unauthorized: Check Strapi GraphQL permissions for Public role');
        console.warn('   Go to Strapi Admin → Settings → Users & Permissions → Roles → Public');
        console.warn('   Enable "find" and "findOne" for Project content type');
      }
      
      // If 404, check if GraphQL plugin is enabled
      if (response.status === 404) {
        console.warn('⚠️ 404 Not Found: Check if GraphQL plugin is enabled in Strapi');
        console.warn('   Go to Strapi Admin → Plugins → GraphQL → Enable');
        console.warn('   Or check if API_URL is correct:', env.API_URL);
      }
      
      return [];
    }

    const result: GraphQLResponse = await response.json();

    if (result.errors) {
      console.error('❌ GraphQL errors:', result.errors);
      return [];
    }

    const projectsData = result.data?.projects || [];

    // Log in both dev and production for debugging
    console.log('✅ Projects fetched:', projectsData.length, 'items for locale:', locale);
    if (projectsData.length > 0) {
      console.log('🔍 First project locale:', projectsData[0]?.locale);
      console.log('🔍 First project title:', projectsData[0]?.title);
      console.log('🔍 All projects data:', JSON.stringify(projectsData, null, 2));
    } else {
      console.warn('⚠️ No projects returned from GraphQL for locale:', locale);
      console.warn('⚠️ GraphQL response:', JSON.stringify(result, null, 2));
    }

    if (projectsData.length === 0) {
      // Log in both dev and production
      console.warn('⚠️ No projects found in Strapi. Make sure:');
      console.warn('  1. Project is created in Strapi');
      console.warn('  2. Project is published (not draft)');
      console.warn('  3. GraphQL permissions are set for Public role');
      console.warn('  4. Project has the correct locale:', locale);
      console.warn('  5. Check Strapi Admin → Content Manager → Project → Check locale and publication status');
      // In production, return empty array instead of fallback to mock projects
      return [];
    }

    return projectsData
      .filter((item) => {
        // Filter by locale to ensure we only get projects with the correct locale
        const itemLocale = item.locale;
        if (itemLocale !== locale) {
          if (process.env.NODE_ENV === 'development') {
            console.warn(`⚠️ Project "${item.title}" has locale "${itemLocale}" but requested "${locale}" - filtering out`);
          }
          return false;
        }
        return true;
      })
      .map((item) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('🔍 Processing project:', item.title, {
            locale: item.locale,
            requestedLocale: locale,
            hasGallery: !!item.gallery && Array.isArray(item.gallery) && item.gallery.length > 0,
            hasDescription: !!item.description,
            descriptionType: Array.isArray(item.description) ? 'array' : typeof item.description,
          });
        }

      // Get gallery images
      const galleryImages: string[] = [];
      if (item.gallery && Array.isArray(item.gallery)) {
        item.gallery.forEach((img: any) => {
          const url = img?.url || '';
          if (url) {
            const fullUrl = getImageUrl(url);
            if (process.env.NODE_ENV === 'development') {
              console.log('🖼️ Gallery image:', url, '→', fullUrl);
            }
            galleryImages.push(fullUrl);
          }
        });
      }

      // Main image from mainImage field or first image from gallery
      const mainImageUrl = item.mainImage?.url;
      const mainImage = mainImageUrl 
        ? getImageUrl(mainImageUrl) 
        : (galleryImages[0] || getImageUrl(undefined));

      const processedProject = {
        documentId: item.documentId || '',
        title: item.title || '',
        sub: item.subtitle || '',
        desc: richTextToPlainText(item.description) || '',
        metric: item.metric || undefined,
        stack: Array.isArray(item.stack) ? item.stack : undefined,
        done: Array.isArray(item.done) ? item.done : [],
        benefits: Array.isArray(item.benefits) ? item.benefits : [],
        outcome: item.outcome || '',
        gallery: galleryImages.length > 0 ? galleryImages : [mainImage], // Fallback to main image if no gallery
        mainImage,
      };

      if (process.env.NODE_ENV === 'development') {
        console.log('📦 Processed project:', processedProject.title, {
          documentId: processedProject.documentId,
          hasGallery: galleryImages.length > 0,
          hasMainImage: !!mainImage,
          stackCount: processedProject.stack?.length || 0,
          galleryCount: galleryImages.length,
        });
      }

      return processedProject;
    });
  } catch (error) {
    console.error('❌ Error fetching projects from Strapi GraphQL:', error);
    return [];
  }
}

