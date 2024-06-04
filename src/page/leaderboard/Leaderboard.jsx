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
            const userData = userDocSnapshot.data();
            leaderboard.push({ id: docRef.id, ...data, username: userData.name, photoURL: userData.photoURL });
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
      <div className="table-responsive ">
        <table className="table table-striped table-bordered rounded text-start align-middle">
          <thead className="table-light">
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
                <td className="d-flex align-items-center">
                  <img src={user.photoURL} alt={user.username} className="user-photo me-2" />
                  {user.username}
                </td>
                <td>{user.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
