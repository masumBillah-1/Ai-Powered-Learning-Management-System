export const updateProgress = async (progress: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(progress);
    }, 800);
  });
};
