import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';

interface BuyRequest {
  walletAddress: string;
  numberOfTickets: number;
  transactionHash: string;
  network: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: BuyRequest = await request.json();
    
    const { walletAddress, numberOfTickets, transactionHash, network } = body;

    // Validate input
    if (!walletAddress || !numberOfTickets || !transactionHash || !network) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate wallet address format
    if (!ethers.isAddress(walletAddress)) {
      return NextResponse.json(
        { error: 'Invalid wallet address' },
        { status: 400 }
      );
    }

    // Validate number of tickets
    if (numberOfTickets < 1 || numberOfTickets > 100) {
      return NextResponse.json(
        { error: 'Number of tickets must be between 1 and 100' },
        { status: 400 }
      );
    }

    // Here you would typically:
    // 1. Verify the transaction on-chain
    // 2. Store the purchase in a database
    // 3. Update the round statistics

    // For now, return success
    return NextResponse.json({
      success: true,
      message: 'Tickets purchased successfully',
      data: {
        walletAddress,
        numberOfTickets,
        transactionHash,
        network,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error: unknown) {
    console.error('Error processing ticket purchase:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to process ticket purchase',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
