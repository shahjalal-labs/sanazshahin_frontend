const notifications = [
  {
    id: 1,
    title: "New user registered successfully.",
    description:
      "A new member has joined the platform. Review profile details if needed.",
  },
  {
    id: 2,
    title: "User subscription upgraded to Premium.",
    description:
      "Access to advanced meal plans and protein calculator enabled.",
  },
  {
    id: 3,
    title: "User account reported for inappropriate content.",
    description: "Please review the flagged recipe or comment.",
  },
  {
    id: 4,
    title: "Inactive users detected (30+ days).",
    description: "Consider sending a re-engagement email campaign.",
  },
];

function Notification() {
  return (
    <section className="w-full pt-[104px]">
      <div className="container mx-auto max-w-[1240px] px-4 pb-10 sm:px-6">
        <h1 className="text-[32px] font-bold leading-tight text-[#2D2D2F] sm:text-[46px]">
          Notification
        </h1>

        <div className="mt-5 space-y-4 sm:mt-6 sm:space-y-5">
          {notifications.map((item) => (
            <article
              key={item.id}
              className="rounded-[20px] border border-[#B8C8E6] bg-[#F9FAFD] px-4 py-5 shadow-[0_4px_16px_rgba(9,30,66,0.08)] sm:px-6 sm:py-6"
            >
              <h2 className="text-xl font-semibold leading-snug text-[#2E2E31] ">
                {item.title}
              </h2>
              <p className="mt-2 text-base leading-relaxed text-[#657389] ">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Notification;
