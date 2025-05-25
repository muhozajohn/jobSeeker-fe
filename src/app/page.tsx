// // app/page.tsx
// 'use client';

// import { useAuth } from "@/hooks/hooks";

// export default function Home() {
//   const { isAuthenticated, user } = useAuth();
  
//   return (
//     <main>
//       {isAuthenticated ? (
//         <div>Welcome, {user?.email}</div>
//       ) : (
//         <div>Please log in</div>
//       )}
//     </main>
//   );
// }

import React from 'react'

const Home = () => {
  return (
    <div>Home</div>
  )
}

export default Home