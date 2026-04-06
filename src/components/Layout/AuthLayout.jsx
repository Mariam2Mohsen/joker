import Logo from '../UI/Logo';

export const AuthLayout = ({ title, subtitle, children, bgColor = "bg-[#8E9091]" }) => (
  <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4">
    <div className="w-full max-w-2xl bg-white shadow-2xl rounded-sm overflow-hidden">
      <div className="bg-[#E5E5E5] p-8 text-center">
        <h1 className="text-4xl font-bold mb-4">{title}</h1>
        <div className="flex justify-center">
          <Logo className="h-20" />
        </div>
      </div>
      <div className={`${bgColor} p-8`}>
        <h2 className="text-center font-bold uppercase mb-6">{subtitle}</h2>
        {children}
      </div>
    </div>
  </div>
);