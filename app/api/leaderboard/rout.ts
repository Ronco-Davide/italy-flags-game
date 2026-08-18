import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

// Si collega da solo grazie alle chiavi nel tuo .env.local!
const redis = Redis.fromEnv();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, userId, score, category, date } = body;

    if (!username || !userId || score === undefined || !category || !date) {
      return NextResponse.json({ error: "Dati mancanti" }, { status: 400 });
    }

    const leaderboardKey = `leaderboard:${category}:${date}`;
    // Uniamo il nome scelto a un ID univoco per evitare sovrascritture di omonimi
    const member = `${username.substring(0, 15)}:::${userId}`;
    const numericScore = Number(score);

    // Salva il punteggio
    await redis.zadd(leaderboardKey, { score: numericScore, member });

    // Recupera la Top 3 di oggi
    const top3Raw = await redis.zrange(leaderboardKey, 0, 2, { rev: true, withScores: true });
    
    const top3 = [];
    for (let i = 0; i < top3Raw.length; i += 2) {
      const rawMember = String(top3Raw[i]);
      const memberScore = Number(top3Raw[i + 1]);
      top3.push({
        name: rawMember.split(':::')[0], 
        score: memberScore
      });
    }

    // Matematica: Quanti ne hai battuti?
    const totalPlayers = await redis.zcard(leaderboardKey);
    const rank = await redis.zrevrank(leaderboardKey, member); 

    let beatenPercentage = 0;
    if (totalPlayers > 1 && rank !== null) {
      const playersBeaten = totalPlayers - (rank + 1);
      beatenPercentage = (playersBeaten / totalPlayers) * 100;
    }

    return NextResponse.json({
      top3,
      rank: rank !== null ? rank + 1 : null,
      totalPlayers,
      beatenPercentage: Math.round(beatenPercentage)
    });

  } catch (error) {
    console.error("Errore Leaderboard:", error);
    return NextResponse.json({ error: "Errore salvataggio" }, { status: 500 });
  }
}