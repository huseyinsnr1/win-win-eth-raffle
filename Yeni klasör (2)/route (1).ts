import { NextRequest, NextResponse } from 'next/server';

interface AdminAction {
  action: 'setTicketPrice' | 'setMaxTickets' | 'setRoundDuration' | 'startRound' | 'endRound' | 'pauseRaffle' | 'unpauseRaffle';
  value?: string | number;
  adminKey: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: AdminAction = await request.json();
    
    const { action, value, adminKey } = body;

    // Validate admin key
    const ADMIN_KEY = process.env.ADMIN_SECRET_KEY || 'your-admin-secret-key';
    
    if (adminKey !== ADMIN_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid admin key' },
        { status: 401 }
      );
    }

    // Validate action
    const validActions = [
      'setTicketPrice',
      'setMaxTickets',
      'setRoundDuration',
      'startRound',
      'endRound',
      'pauseRaffle',
      'unpauseRaffle'
    ];

    if (!validActions.includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

    // Process the admin action
    switch (action) {
      case 'setTicketPrice':
        if (typeof value !== 'number' || value <= 0) {
          return NextResponse.json(
            { error: 'Invalid ticket price' },
            { status: 400 }
          );
        }
        // Update ticket price in contract
        break;

      case 'setMaxTickets':
        if (typeof value !== 'number' || value <= 0) {
          return NextResponse.json(
            { error: 'Invalid max tickets value' },
            { status: 400 }
          );
        }
        // Update max tickets in contract
        break;

      case 'setRoundDuration':
        if (typeof value !== 'number' || value <= 0) {
          return NextResponse.json(
            { error: 'Invalid round duration' },
            { status: 400 }
          );
        }
        // Update round duration in contract
        break;

      case 'startRound':
        // Start a new round
        break;

      case 'endRound':
        // End the current round
        break;

      case 'pauseRaffle':
        // Pause the raffle
        break;

      case 'unpauseRaffle':
        // Unpause the raffle
        break;
    }

    return NextResponse.json({
      success: true,
      message: `Action ${action} completed successfully`,
      data: {
        action,
        value,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error: unknown) {
    console.error('Error processing admin action:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to process admin action',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Get admin key from headers
    const adminKey = request.headers.get('x-admin-key');
    const ADMIN_KEY = process.env.ADMIN_SECRET_KEY || 'your-admin-secret-key';
    
    if (adminKey !== ADMIN_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid admin key' },
        { status: 401 }
      );
    }

    // Return current admin settings
    return NextResponse.json({
      success: true,
      data: {
        rafflePaused: false,
        currentRound: 1,
        ticketPrice: '0.001',
        maxTickets: 1000,
        roundDuration: 3600000 // 1 hour in ms
      }
    });

  } catch (error: unknown) {
    console.error('Error fetching admin data:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch admin data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
