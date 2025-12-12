// src/pages/Home.jsx

import React from 'react';
import { Link } from 'react-router-dom';

// 假设你的个人资料图片路径
const PROFILE_PIC_URL = "/public/Profile/profile.jpg"; // 请确保在 public 文件夹下放置你的图片

const Home = () => {
  return (
    // 添加一个额外的边框，模拟 Zine 杂志内页的分割感
    <section className="mt-8 border-2 border-primary p-4 md:p-6 shadow-md">
      
      {/* 1. 标题和简介区 */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-6 border-b-2 border-secondary/50">
        
        {/* 标题和摘要 */}
        <div className="md:w-3/4">
          <h1 className="text-4xl md:text-6xl mb-2 ascii-title text-highlight">
            ROTASY2NIAA_DEV::HOME_LOG
          </h1>
          <p className="text-xl md:text-2xl sometype-mono mb-4 text-primary">
            > A Front-End Engineer & <span className="text-highlight">Digital Craftsman</span>.<br/>
            > Building <span className="text-highlight">Interactive Experiences</span> with React/Vue and the <span className="text-highlight">Zine Glitch Aesthetic</span>.
          </p>
          
          {/* 快速入口按钮 */}
          <div className="space-x-4 mt-4">
            <Link 
              to="/works" 
              className="px-4 py-2 bg-primary text-background border-2 border-primary hover:bg-highlight hover:text-primary transition-colors duration-300 sometype-mono font-bold shadow-md"
            >
              [View Works]
            </Link>
            <Link 
              to="/about" 
              className="px-4 py-2 border-2 border-primary text-primary hover:bg-secondary/50 transition-colors duration-300 sometype-mono font-bold shadow-md"
            >
              [Read About Me]
            </Link>
          </div>
        </div>

        {/* 个人头像 - Zine 风格裁剪 */}
        {/* 请注意，img-zine 类依赖于我们在 App.css 中定义的滤镜和裁剪样式 */}
        <div className="md:w-1/4 flex justify-center md:justify-end mt-6 md:mt-0">
          <div className="w-32 h-32 md:w-40 md:h-40 relative img-zine">
            <img 
              src={PROFILE_PIC_URL} 
              alt="Profile Glitch Portrait" 
              className="w-full h-full object-cover"
            />
            {/* 模拟扫描线效果，增加赛博朋克感 */}
            <div className="absolute inset-0 z-10 scanline-overlay"></div>
          </div>
        </div>
        
      </div>

      {/* 2. 核心技能区 (Core Skills Log) */}
      <div className="sometype-mono">
        <h2 className="text-3xl ascii-title text-primary mb-3">
          // ACCESS_LOG::CORE_SKILLS
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-lg">
          
          {/* 技能组 1 */}
          <ul className="zine-card p-3">
            <li className="font-bold text-highlight border-b border-secondary/50 mb-1">FRONT-END</li>
            <li>React & Vite</li>
            <li>Tailwind CSS</li>
            <li>Vue & Nuxt</li>
          </ul>

          {/* 技能组 2 */}
          <ul className="zine-card p-3">
            <li className="font-bold text-highlight border-b border-secondary/50 mb-1">BACK-END</li>
            <li>Node.js (Express)</li>
            <li>Python (Flask)</li>
            <li>REST API Design</li>
          </ul>

          {/* 技能组 3 */}
          <ul className="zine-card p-3">
            <li className="font-bold text-highlight border-b border-secondary/50 mb-1">DATABASE</li>
            <li>PostgreSQL</li>
            <li>MongoDB</li>
            <li>Prisma ORM</li>
          </ul>

          {/* 技能组 4 */}
          <ul className="zine-card p-3">
            <li className="font-bold text-highlight border-b border-secondary/50 mb-1">TOOLS/FLOW</li>
            <li>Git & GitHub</li>
            <li>Docker Basics</li>
            <li>CI/CD (Vercel)</li>
          </ul>
        </div>
      </div>
      
      {/* 3. 社交链接区 */}
      <div className="mt-8 pt-6 border-t-2 border-secondary/50 sometype-mono text-center">
        <p className="text-sm text-secondary/80 mb-2">
          > [STATUS]: ONLINE | READY FOR CONNECTION_REQUEST
        </p>
        <div className="space-x-4">
          <a href="#" target="_blank" className="text-highlight hover:text-primary transition-colors duration-300">[GitHub]</a>
          <a href="#" target="_blank" className="text-highlight hover:text-primary transition-colors duration-300">[LinkedIn]</a>
          <a href="#" target="_blank" className="text-highlight hover:text-primary transition-colors duration-300">[Twitter/X]</a>
        </div>
      </div>

    </section>
  );
};

export default Home;