const NotFoundPage = () => {
  return (
    <div className="flex flex-col justify-center items-center flex-grow mt-[10%] gap-y-3 mx-2">
      <h1 className=" text-2xl sm:text-5xl font-bold text-center">
        404 Not Found
      </h1>
      <p className="text-[11px] sm:text-[12px] whitespace-pre-wrap ">
        Your visited page not found.You mau go home now
      </p>
      <button className="bg-red-500 hover:bg-red-600 font-semibold text-slate-200 rounded-md p-1 sm:p-2 my-5">
        <a href="/">Home Page</a>
      </button>
    </div>
  );
};

export default NotFoundPage;
