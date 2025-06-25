import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await request.headers;
    const signature = headersList.get('x-webhook-signature');

    // Verify webhook signature
    if (!signature || signature !== process.env.WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // Process webhook data
    const data = JSON.parse(body);
    
    // Handle different webhook events
    switch (data.type) {
      case 'code_execution_complete':
        // Handle code execution completion
        console.log('Code execution completed:', data);
        break;
      case 'ai_analysis_complete':
        // Handle AI analysis completion
        console.log('AI analysis completed:', data);
        break;
      default:
        console.log('Unknown webhook type:', data.type);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Webhook endpoint is active' });
} 