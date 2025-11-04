import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { env } from '@/config/env';

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let { name, email, company, about } = body;

    // Sanitize input (basic XSS protection and length limits)
    name = String(name || '').trim().slice(0, 100);
    email = String(email || '').trim().slice(0, 254);
    company = String(company || '').trim().slice(0, 100);
    about = String(about || '').trim().slice(0, 5000);

    // Валідація
    if (!name || !email || !about) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Email валідація
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Перевірка наявності API ключа
    if (!env.RESEND_API_KEY) {
      if (env.IS_DEVELOPMENT) {
        console.error('RESEND_API_KEY is not set in environment variables');
      }
      return NextResponse.json(
        { error: 'Email service is not configured. Please set RESEND_API_KEY in .env.local' },
        { status: 500 }
      );
    }

    // Ініціалізація Resend з API ключем
    const resend = new Resend(env.RESEND_API_KEY);

    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev', // Тимчасовий email від Resend (без формату імені)
      to: env.CONTACT_EMAIL,
      replyTo: email, // Відповідь буде йти на email відправника
      subject: `Нове повідомлення з контактної форми: ${company || 'Без компанії'}`,
      html: `
        <h2>Нове повідомлення з контактної форми</h2>
        <p><strong>Ім'я:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Компанія / Ніша:</strong> ${company ? escapeHtml(company) : 'Не вказано'}</p>
        <p><strong>Про завдання:</strong></p>
        <p>${escapeHtml(about).replace(/\n/g, '<br>')}</p>
      `,
      text: `
Нове повідомлення з контактної форми

Ім'я: ${name}
Email: ${email}
Компанія / Ніша: ${company || 'Не вказано'}

Про завдання:
${about}
      `.trim(),
    });

    if (error) {
      if (env.IS_DEVELOPMENT) {
        console.error('Resend error:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
      }
      return NextResponse.json(
        { 
          error: 'Failed to send email', 
          details: env.IS_DEVELOPMENT ? (error.message || JSON.stringify(error)) : undefined,
          code: error.name || 'RESEND_ERROR'
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Email sent successfully', id: data?.id },
      { status: 200 }
    );
  } catch (error: any) {
    if (env.IS_DEVELOPMENT) {
      console.error('Error sending email:', error);
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to send email', 
        details: env.IS_DEVELOPMENT ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
