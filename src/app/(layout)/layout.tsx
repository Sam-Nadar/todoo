"use client"
// import React from "react";

// export default function({children}:{
//     children : React.ReactNode
// }){
//     return <div>
//         <div>
//             hi navbar
//         </div>
//         {children}
//     </div>
// }

import React from 'react';
import Image from 'next/image'; // For Next.js projects (adjust if you're using something else)
import { PiListPlusBold } from 'react-icons/pi'; // Import the PiListPlusBold icon from react-icons
import { useRouter } from 'next/navigation';


const Navbar = ({children}:{
        children : React.ReactNode}) => {
  // Function to handle click on PiListPlusBold
  const router = useRouter();
  const handleIconClick = () => {
    console.log('PiListPlusBold icon clicked!');
    router.push('/createTodo')
  };

  return (
    <div>
    <nav className="flex items-center justify-between p-4 bg-gray-800 text-white">
      {/* Left: Logo */}
      <div className="flex items-center">
        <Image
          src="/logo.png" // Path to your logo image
          alt="Logo"
          width={100}
          height={200}
        />
      </div>

      {/* Right: PiListPlusBold Icon */}
      <div>
        <PiListPlusBold
          size={30}
          className="cursor-pointer hover:text-gray-400 transition-colors"
          onClick={handleIconClick} // Click handler to log to console
        />
      </div>
    </nav>
    {children}
    </div>
  );
};

export default Navbar;
