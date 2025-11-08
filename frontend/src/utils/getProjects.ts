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
      gallery?: Array<{
        url: string;
        alternativeText?: string;
      }>;
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
 * description is Rich Text (Blocks) - GraphQL will return it as array
 */
const PROJECTS_QUERY = `
  query GetProjects {
    projects {
      documentId
      title
      subtitle
      description
      metric
      stack
      done
      benefits
      outcome
      gallery {
        url
        alternativeText
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
    
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Fetching projects from GraphQL:', graphqlUrl);
    }

    const response = await fetch(graphqlUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: PROJECTS_QUERY,
      }),
      next: { revalidate: 0 }, // Always fetch fresh in development
      cache: 'no-store', // Prevent caching issues
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Failed to fetch projects:', response.status, response.statusText);
      console.error('Response:', errorText);
      
      // If 401, log helpful message about permissions
      if (response.status === 401) {
        console.warn('⚠️ 401 Unauthorized: Check Strapi GraphQL permissions for Public role');
        console.warn('   Go to Strapi Admin → Settings → Users & Permissions → Roles → Public');
        console.warn('   Enable "find" and "findOne" for Project content type');
      }
      
      return [];
    }

    const result: GraphQLResponse = await response.json();

    if (result.errors) {
      console.error('❌ GraphQL errors:', result.errors);
      return [];
    }

    const projects = result.data?.projects || [];

    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Projects fetched:', projects.length, 'items');
    }

    if (projects.length === 0) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('⚠️ No projects found in Strapi. Make sure:');
        console.warn('  1. Project is created in Strapi');
        console.warn('  2. Project is published (not draft)');
        console.warn('  3. GraphQL permissions are set for Public role');
      }
      return [];
    }

    return projects.map((item) => {
      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 Processing project:', item.title, {
          hasGallery: !!item.gallery && item.gallery.length > 0,
          hasDescription: !!item.description,
          descriptionType: Array.isArray(item.description) ? 'array' : typeof item.description,
        });
      }

      // Get gallery images
      const galleryImages: string[] = [];
      if (item.gallery && Array.isArray(item.gallery)) {
        item.gallery.forEach((img: any) => {
          const url = img.url || '';
          if (url) {
            const fullUrl = getImageUrl(url);
            if (process.env.NODE_ENV === 'development') {
              console.log('🖼️ Gallery image:', url, '→', fullUrl);
            }
            galleryImages.push(fullUrl);
          }
        });
      }

      // Main image is the first image from gallery
      const mainImage = galleryImages[0] || getImageUrl(undefined);

      const processedProject = {
        documentId: item.documentId,
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
        });
      }

      return processedProject;
    });
  } catch (error) {
    console.error('❌ Error fetching projects from Strapi GraphQL:', error);
    return [];
  }
}

