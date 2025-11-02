'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Trophy, Users, TrendingUp, ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface LeaderboardEntry {
  address: string;
  reward: string;
  entries: number;
}

interface Winner {
  address: string;
  tickets: number;
  prize: string;
  rank: number;
}

interface RoundHistory {
  roundNumber: number;
  endTime: number;
  totalPrizePool: string;
  totalParticipants: number;
  winners: Winner[];
}

export default function LeaderboardPage(): JSX.Element {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [totalPool, setTotalPool] = useState<string>('0');
  const [participants, setParticipants] = useState<number>(0);
  const [ethToUsd, setEthToUsd] = useState<number>(0);
  const [roundHistory, setRoundHistory] = useState<RoundHistory[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  // Fetch ETH to USD conversion
  useEffect(() => {
    async function fetchEthPrice(): Promise<void> {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
        const data = await res.json();
        setEthToUsd(data.ethereum.usd);
      } catch (error) {
        console.error('Error fetching ETH price:', error);
        setEthToUsd(3500);
      }
    }
    fetchEthPrice();
  }, []);

  // Fetch Leaderboard
  useEffect(() => {
    async function fetchLeaderboard(): Promise<void> {
      try {
        const res = await fetch('/api/leaderboard');
        const data = await res.json();
        
        // Always ensure we have proper defaults
        setLeaderboard(data.leaderboard && data.leaderboard.length > 0 ? data.leaderboard : []);
        setTotalPool(data.totalPool && parseFloat(data.totalPool) > 0 ? data.totalPool : '0');
        setParticipants(data.participants && data.participants > 0 ? data.participants : 0);
      } catch (e) {
        console.error('Error fetching leaderboard:', e);
        // Keep values at 0 on error
        setLeaderboard([]);
        setTotalPool('0');
        setParticipants(0);
      }
    }
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 10000);
    return () => clearInterval(interval);
  }, []);

  // Fetch Round History
  useEffect(() => {
    async function fetchRoundHistory(): Promise<void> {
      try {
        const res = await fetch('/api/round-history');
        const data = await res.json();
        // Reverse to show latest first
        const history = data.history || [];
        setRoundHistory(history.reverse());
      } catch (e) {
        console.error('Error fetching round history:', e);
        setRoundHistory([]);
      }
    }
    fetchRoundHistory();
    const interval = setInterval(fetchRoundHistory, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4 pt-16">
      <div className="fixed top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-400/20 via-blue-300/10 to-transparent blur-3xl pointer-events-none" />
      
      <div className="relative max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/">
            <Button variant="outline" className="mb-6 border-blue-200 text-blue-600 hover:bg-blue-50">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Raffle
            </Button>
          </Link>
          
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent flex items-center justify-center gap-3">
              <Trophy className="w-12 h-12 text-blue-600" />
              Leaderboard
            </h1>
            <p className="text-gray-600">Latest winners and past rounds</p>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid md:grid-cols-3 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-white/70 backdrop-blur-xl border-2 border-blue-200 shadow-xl">
            <CardContent className="p-6 text-center">
              <Trophy className="w-10 h-10 mx-auto mb-3 text-blue-600" />
              <p className="text-sm text-gray-600 mb-1">Total Prize Pool</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                {totalPool} ETH
              </p>
              <p className="text-sm text-gray-500 mt-1">
                ≈ ${(parseFloat(totalPool) * ethToUsd).toFixed(2)}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-xl border-2 border-blue-200 shadow-xl">
            <CardContent className="p-6 text-center">
              <Users className="w-10 h-10 mx-auto mb-3 text-blue-600" />
              <p className="text-sm text-gray-600 mb-1">Total Players</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                {participants}
              </p>
              <p className="text-sm text-gray-500 mt-1">Active participants</p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-xl border-2 border-blue-200 shadow-xl">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-10 h-10 mx-auto mb-3 text-blue-600" />
              <p className="text-sm text-gray-600 mb-1">Average Entry</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                {participants > 0 ? (parseFloat(totalPool) / participants).toFixed(4) : '0'}
              </p>
              <p className="text-sm text-gray-500 mt-1">ETH per player</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Toggle Buttons */}
        <motion.div
          className="flex justify-center gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Button
            onClick={() => setShowHistory(false)}
            className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
              !showHistory
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg'
                : 'bg-white/70 text-blue-600 border-2 border-blue-200 hover:bg-blue-50'
            }`}
          >
            Current Round
          </Button>
          <Button
            onClick={() => setShowHistory(true)}
            className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
              showHistory
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg'
                : 'bg-white/70 text-blue-600 border-2 border-blue-200 hover:bg-blue-50'
            }`}
          >
            Past Winners ({roundHistory.length > 1 ? roundHistory.length - 1 : 0})
          </Button>
        </motion.div>

        {/* Latest Round Winners */}
        {!showHistory && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="bg-white/70 backdrop-blur-xl border-2 border-blue-200 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Trophy className="w-6 h-6 text-yellow-500" />
                  <h2 className="text-2xl font-bold text-blue-600">Latest Round Winners</h2>
                </div>
                
                {roundHistory.length === 0 || !roundHistory[0] || roundHistory[0].winners.length === 0 ? (
                  <div className="text-center py-20 text-gray-400">
                    <Trophy className="w-20 h-20 mx-auto mb-4 opacity-30" />
                    <p className="text-xl">No completed rounds yet</p>
                    <p className="text-sm mt-2">Winners will appear here after the first round ends</p>
                    <Link href="/">
                      <Button className="mt-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white">
                        Join Raffle
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div>
                    {/* Latest Round Header */}
                    <div className="flex justify-between items-start mb-6 pb-4 border-b-2 border-blue-200">
                      <div>
                        <h3 className="text-2xl font-bold text-blue-600 mb-2">
                          Round #{roundHistory[0].roundNumber}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {new Date(roundHistory[0].endTime).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 mb-1">Prize Pool</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {roundHistory[0].totalPrizePool} ETH
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          ≈ ${(parseFloat(roundHistory[0].totalPrizePool) * ethToUsd).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Round Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="bg-white rounded-lg p-4 text-center border border-blue-100">
                        <p className="text-xs text-gray-600 mb-1">Total Players</p>
                        <p className="text-2xl font-bold text-blue-600">{roundHistory[0].totalParticipants}</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 text-center border border-blue-100">
                        <p className="text-xs text-gray-600 mb-1">Winners</p>
                        <p className="text-2xl font-bold text-emerald-600">{roundHistory[0].winners.length}</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 text-center border border-blue-100">
                        <p className="text-xs text-gray-600 mb-1">Win Rate</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {((roundHistory[0].winners.length / roundHistory[0].totalParticipants) * 100).toFixed(0)}%
                        </p>
                      </div>
                    </div>

                    {/* Winners List */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-yellow-500" />
                        Winners:
                      </h4>
                      {roundHistory[0].winners.map((winner, winnerIndex) => (
                        <motion.div
                          key={winnerIndex}
                          className={`flex justify-between items-center p-5 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                            winnerIndex === 0
                              ? 'bg-gradient-to-r from-yellow-100 to-yellow-50 border-yellow-300 shadow-md'
                              : winnerIndex === 1
                              ? 'bg-gradient-to-r from-gray-100 to-gray-50 border-gray-300'
                              : winnerIndex === 2
                              ? 'bg-gradient-to-r from-orange-100 to-orange-50 border-orange-300'
                              : 'bg-white border-blue-100'
                          }`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: winnerIndex * 0.05 }}
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shadow-lg ${
                                winnerIndex === 0
                                  ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-white'
                                  : winnerIndex === 1
                                  ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white'
                                  : winnerIndex === 2
                                  ? 'bg-gradient-to-br from-orange-400 to-orange-500 text-white'
                                  : 'bg-gradient-to-br from-blue-200 to-blue-300 text-blue-800'
                              }`}
                            >
                              {winner.rank}
                            </div>
                            <div>
                              <p className="font-mono font-bold text-gray-800 text-lg">
                                {winner.address.slice(0, 10)}...{winner.address.slice(-8)}
                              </p>
                              <p className="text-sm text-gray-600">{winner.tickets} tickets</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-emerald-600">+{winner.prize} ETH</p>
                            <p className="text-sm text-gray-500 mt-1">
                              ≈ ${(parseFloat(winner.prize) * ethToUsd).toFixed(2)}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Past Winners History */}
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="bg-white/70 backdrop-blur-xl border-2 border-blue-200 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Trophy className="w-6 h-6 text-yellow-500" />
                  <h2 className="text-2xl font-bold text-blue-600">Past Winners</h2>
                </div>
                
                {roundHistory.length <= 1 ? (
                  <div className="text-center py-20 text-gray-400">
                    <Trophy className="w-20 h-20 mx-auto mb-4 opacity-30" />
                    <p className="text-xl">No past rounds yet</p>
                    <p className="text-sm mt-2">Past rounds will appear here after multiple rounds complete</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {roundHistory.slice(1).map((round, roundIndex) => (
                      <motion.div
                        key={roundIndex}
                        className="bg-gradient-to-br from-blue-50 to-white rounded-xl border-2 border-blue-200 p-6 shadow-lg"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: roundIndex * 0.1 }}
                      >
                        {/* Round Header */}
                        <div className="flex justify-between items-start mb-4 pb-4 border-b-2 border-blue-200">
                          <div>
                            <h3 className="text-2xl font-bold text-blue-600 mb-2">
                              Round #{round.roundNumber}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {new Date(round.endTime).toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600 mb-1">Prize Pool</p>
                            <p className="text-2xl font-bold text-blue-600">
                              {round.totalPrizePool} ETH
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              ≈ ${(parseFloat(round.totalPrizePool) * ethToUsd).toFixed(2)}
                            </p>
                          </div>
                        </div>

                        {/* Round Stats */}
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="bg-white rounded-lg p-3 text-center border border-blue-100">
                            <p className="text-xs text-gray-600 mb-1">Total Players</p>
                            <p className="text-xl font-bold text-blue-600">{round.totalParticipants}</p>
                          </div>
                          <div className="bg-white rounded-lg p-3 text-center border border-blue-100">
                            <p className="text-xs text-gray-600 mb-1">Winners</p>
                            <p className="text-xl font-bold text-emerald-600">{round.winners.length}</p>
                          </div>
                          <div className="bg-white rounded-lg p-3 text-center border border-blue-100">
                            <p className="text-xs text-gray-600 mb-1">Win Rate</p>
                            <p className="text-xl font-bold text-blue-600">
                              {((round.winners.length / round.totalParticipants) * 100).toFixed(0)}%
                            </p>
                          </div>
                        </div>

                        {/* Winners List */}
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-yellow-500" />
                            Winners:
                          </h4>
                          {round.winners.map((winner, winnerIndex) => (
                            <div
                              key={winnerIndex}
                              className={`flex justify-between items-center p-4 rounded-lg border-2 ${
                                winnerIndex === 0
                                  ? 'bg-gradient-to-r from-yellow-100 to-yellow-50 border-yellow-300'
                                  : winnerIndex === 1
                                  ? 'bg-gradient-to-r from-gray-100 to-gray-50 border-gray-300'
                                  : winnerIndex === 2
                                  ? 'bg-gradient-to-r from-orange-100 to-orange-50 border-orange-300'
                                  : 'bg-white border-blue-100'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-md ${
                                    winnerIndex === 0
                                      ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-white'
                                      : winnerIndex === 1
                                      ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white'
                                      : winnerIndex === 2
                                      ? 'bg-gradient-to-br from-orange-400 to-orange-500 text-white'
                                      : 'bg-gradient-to-br from-blue-200 to-blue-300 text-blue-800'
                                  }`}
                                >
                                  {winner.rank}
                                </div>
                                <div>
                                  <p className="font-mono font-semibold text-gray-800">
                                    {winner.address.slice(0, 10)}...{winner.address.slice(-8)}
                                  </p>
                                  <p className="text-xs text-gray-600">{winner.tickets} tickets</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-emerald-600">+{winner.prize} ETH</p>
                                <p className="text-xs text-gray-500">
                                  ≈ ${(parseFloat(winner.prize) * ethToUsd).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
