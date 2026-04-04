import toast from 'react-hot-toast';

export const useNotification = () => {
  const notifySuccess = (msg) =>
    toast.success(msg, {
      style: {
        borderRadius: '0',
        background: '#333',
        color: '#fff',
        fontSize: '12px',
        fontWeight: 'bold',
      },
    });

  const notifyError = (msg) =>
    toast.error(msg, {
      style: {
        borderRadius: '0',
        background: '#a00',
        color: '#fff',
        fontSize: '12px',
        fontWeight: 'bold',
      },
    });

  return { notifySuccess, notifyError };
};