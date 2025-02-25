import React from 'react'

export default function About() {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className="max-w-2xl mx-auto text-center pl-20">
        <div className=''>
          <h1 className='text-3xl font-semibold text-center my-7'>About Kevin's Blog</h1>
          <div className="text-md text-gray-500 flex flex-col gap-6 dark:text-gray-300">
            <p>Welcome to my Blog! The purpose of this blog is to act as a portfolio as well as a platform for sharing my thoughts on any topics that interest me. 
              Said topics can range between general technology and software development to volleyball and manga.
            </p>
            <p>I am a soon-to-be graduate from UTS, who completed studying Computing Science (Honours) on January 2025. I love anything software development related, and 
              am currently looking to enter the industry in either a software development or DevOps role. I'm Korean and have been living in Australia since 2010, attending 
              a local public primary school and high school before entering University. I speak fluent English on top of Korean and conversational Japanese. 
              I am based in Sydney, NSW Australia, and current work at King's Own Institute as part of the IT department. You can connect with me on LinkedIn or view my GitHub in the 
              footer below this page.
            </p>
            <p>I play a lot of volleyball, including my local Social Competition with my team Roki Raccoons at Baulkham Hills Volleyball. I also play a lot of video games,
              with a wide range of different genres. I play (to a decent skill level) League of Legends, StarCraft 2 & Remastered, Tekken, Hearthstone, Tetris, Osu!, Counter-Strike 
              (RIP CSGO), Terraria, etc. I also read a lot of manga and watch a lot of anime, and my top 3 manga series are: Ajin, Chainsawman, and Yofukashi no Uta (Call of the Nightwalkers).
            </p>
          </div>
        </div>
      </div>
      <div className="max-w-5xl flex flex-wrap gap-2 justify-center mt-6">
        <img src='/images/japan_inari_bench_alex_lawrence.jpg' alt='Kyoto Inari Shrine bench with friends' className='h-[400px]' />
        <img src='/images/japan_kyoto_kimono_twoshot_alex.jpg' alt='Kyoto Kiyomizu-dera Kimono two shot' className='h-[400px]' />
        <img src='/images/sofa_sleep_square_pillow.jpg' alt='sleeping on the couch' className='h-[400px]' />
        <img src='/images/vball_spike.png' alt='volleyball spiking practice' className='h-[400px]' />
        <img src='/images/deadlift.jpg' alt='deadlift' className='h-[400px]' />
      </div>
    </div>
  )
}
