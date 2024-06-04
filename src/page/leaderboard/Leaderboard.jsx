import React, { useEffect, useState } from 'react';
import { getFirestore, collection, query, orderBy, getDocs, doc, getDoc } from 'firebase/firestore';
import './leaderboard.scss';

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    try {
      const db = getFirestore();
      const leaderboardRef = collection(db, 'quiz_results');
      const leaderboardQuery = query(leaderboardRef, orderBy('score', 'desc'));
      const snapshot = await getDocs(leaderboardQuery);

      const leaderboard = [];
      for (const docRef of snapshot.docs) {
        const data = docRef.data();
        if (data && data.userId) {
          const userDocRef = doc(db, 'users', data.userId);
          const userDocSnapshot = await getDoc(userDocRef);
          if (userDocSnapshot.exists()) {
            leaderboard.push({ id: docRef.id, ...data, username: userDocSnapshot.data().name });
          }
        }
      }      
      setLeaderboardData(leaderboard);
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Таблица лидеров</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Имя пользователя</th>
            <th>Счет</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.map((user, index) => (
            <tr key={user.id}>
              <td>{index + 1}</td>
              <td>{user.username}</td>
              <td>{user.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
