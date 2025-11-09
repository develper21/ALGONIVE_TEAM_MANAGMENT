import React from "react";
// import DEFAULT_PROFILE_PICTURE from "../../assets/images/default_user.webp"

const UserCard = ({ userInfo }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md shadow-gray-100 dark:shadow-slate-900/50 border border-gray-200 dark:border-slate-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={userInfo?.profileImageUrl || ""}
            alt={`Avatar`}
            className="w-12 h-12 rounded-full border-2 border-white"
          />
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{userInfo?.name}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">{userInfo?.email}</p>
          </div>
        </div>
      </div>

      <div className="flex items-end gap-3 mt-5">
        <StatCard
          label="Pending"
          count={userInfo?.pendingTasks || 0}
          status="Pending"
        />
        <StatCard
          label="In Progress"
          count={userInfo?.inProgressTasks || 0}
          status="In Progress"
        />
        <StatCard
          label="Completed"
          count={userInfo?.completedTasks || 0}
          status="Completed"
        />
      </div>
    </div>
  );
};

export default UserCard;

const StatCard = ({ label, count, status }) => {
  const getStatusTagColor = () => {
    switch (status) {
      case "In Progress":
        return "text-cyan-500 bg-gray-50 dark:bg-slate-700";
      case "Completed":
        return "text-lime-500 bg-gray-50 dark:bg-slate-700";
      default:
        return "text-violet-500 bg-gray-50 dark:bg-slate-700";
    }
  };

  return (
    <div
      className={`flex-1 text-[10px] font-medium ${getStatusTagColor()} px-4 py-0.5 rounded`}
    >
      <span className="text-[12px] font-semibold">{count}</span> <br /> {label}
    </div>
  );
};
