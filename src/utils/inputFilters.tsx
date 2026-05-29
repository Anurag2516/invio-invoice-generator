export const percentageFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  if (!/^\d*\.?\d*$/.test(value)) {
    e.target.value = value.slice(0, -1);
    return false;
  }
  if (Number(value) > 100) {
    e.target.value = value.slice(0, -1);
    return false;
  }
  return true;
};

export const positiveNumberFilter = (
  e: React.ChangeEvent<HTMLInputElement>,
) => {
  const value = e.target.value;
  if (!/^\d*\.?\d*$/.test(value)) {
    e.target.value = value.slice(0, -1);
    return false;
  }
  return true;
};

export const phoneNumberFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;

  if (!/^\d*$/.test(value)) {
    e.target.value = value.slice(0, -1);
    return false;
  }

  if (value.length > 10) {
    e.target.value = value.slice(0, 10);
    return false;
  }

  return true;
};