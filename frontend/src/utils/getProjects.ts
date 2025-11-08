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
    projects: {
      data: Array<{
        id: string;
        documentId: string;
        attributes: {
          title: string;
          subtitle?: string;
          description?: string | any[]; // Can be string (HTML) or array (Blocks)
          metric?: string;
          stack?: string[] | null;
          done?: string[] | null;
          benefits?: string[] | null;
          outcome?: string;
          gallery?: {
            data: Array<{
              attributes: {
                url: string;
                alternativeText?: string;
              };
            }>;
          };
          mainImage?: {
            data: {
              attributes: {
                url: string;
              };
            };
          };
        };
      }>;
    };
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
              // Handle both text property and nested text
              let text = child.text || child.children?.[0]?.text || '';
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
 * GraphQL query to fetch projects
 * Using REST API structure for Strapi v4
 */
const PROJECTS_QUERY = `
  query GetProjects {
    projects {
      data {
        id
        documentId
        attributes {
          title
          subtitle
          description
          metric
          stack
          done
          benefits
          outcome
          gallery {
            data {
              attributes {
                url
                alternativeText
              }
            }
          }
          mainImage {
            data {
              attributes {
                url
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * Fetch projects from Strapi using GraphQL
 */
export async function getProjects(): Promise<StrapiProject[]> {
  try {
    if (!env.API_URL) {
      console.warn('⚠️ API_URL is not set, returning empty projects');
      return [];
    }

    const graphqlUrl = `${env.API_URL}/graphql`;
    
    // Log in both dev and production for debugging
    console.log('🔍 Fetching projects from GraphQL:', graphqlUrl);
    console.log('🔍 API_URL:', env.API_URL);
    console.log('🔍 NODE_ENV:', process.env.NODE_ENV);

    const response = await fetch(graphqlUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: PROJECTS_QUERY,
      }),
      next: { 
        revalidate: process.env.NODE_ENV === 'production' ? 3600 : 0, // 1 hour in production, no cache in dev
      },
      cache: process.env.NODE_ENV === 'production' ? 'force-cache' : 'no-store',
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

    const projectsData = result.data?.projects?.data || [];

    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Projects fetched:', projectsData.length, 'items');
    }

    if (projectsData.length === 0) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('⚠️ No projects found in Strapi. Make sure:');
        console.warn('  1. Project is created in Strapi');
        console.warn('  2. Project is published (not draft)');
        console.warn('  3. GraphQL permissions are set for Public role');
      }
      // In production, return empty array instead of fallback to mock projects
      return [];
    }

    return projectsData.map((item) => {
      const attributes = item.attributes;
      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 Processing project:', attributes.title, {
          hasGallery: !!attributes.gallery?.data && attributes.gallery.data.length > 0,
          hasDescription: !!attributes.description,
          descriptionType: Array.isArray(attributes.description) ? 'array' : typeof attributes.description,
        });
      }

      // Get gallery images
      const galleryImages: string[] = [];
      if (attributes.gallery?.data && Array.isArray(attributes.gallery.data)) {
        attributes.gallery.data.forEach((img: any) => {
          const url = img.attributes?.url || '';
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
      const mainImageUrl = attributes.mainImage?.data?.attributes?.url;
      const mainImage = mainImageUrl 
        ? getImageUrl(mainImageUrl) 
        : (galleryImages[0] || getImageUrl(undefined));

      const processedProject = {
        documentId: item.documentId || item.id,
        title: attributes.title || '',
        sub: attributes.subtitle || '',
        desc: richTextToPlainText(attributes.description) || '',
        metric: attributes.metric || undefined,
        stack: Array.isArray(attributes.stack) ? attributes.stack : undefined,
        done: Array.isArray(attributes.done) ? attributes.done : [],
        benefits: Array.isArray(attributes.benefits) ? attributes.benefits : [],
        outcome: attributes.outcome || '',
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

