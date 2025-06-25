import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const headersList = headers();
    const body = await request.json();

    // Verify webhook signature (implement your verification logic)
    const signature = headersList.get('x-webhook-signature');
    
    // Process different webhook types
    const { type, data } = body;

    switch (type) {
      case 'contest.start':
        // Handle contest start
        console.log('Contest started:', data);
        break;
      
      case 'contest.end':
        // Handle contest end
        console.log('Contest ended:', data);
        break;
      
      case 'submission.result':
        // Handle submission result
        console.log('Submission result:', data);
        break;
      
      case 'user.achievement':
        // Handle user achievement
        console.log('User achievement:', data);
        break;
      
      default:
        console.log('Unknown webhook type:', type);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Webhook endpoint is active' });
} 