import React from 'react';
import { Link } from 'react-router-dom';

const SectionHeader = ({ title, linkTo = '#', linkText = 'SEE ALL' }) => (
  <div className="flex justify-between items-center mb-8">
    <h2 className="text-3xl font-extrabold text-[#102C57] tracking-tight">{title}</h2>
    <Link
      to={linkTo}
      className="bg-[#EADBC8]/30 border border-[#EADBC8] text-[#102C57] px-6 py-2 rounded-xl text-xs font-bold uppercase hover:bg-[#102C57] hover:text-[#FEFAF6] transition-all shadow-sm"
    >
      {linkText}
    </Link>
  </div>
);

export default SectionHeader;
