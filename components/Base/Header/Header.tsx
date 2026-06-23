const Header = ({
  className = "",
  header = "",
  headerContainerClassName = "",
  actionButtons = <></>,
  isStatistics = false,
  statistics = <></>,
  statisticsClassName = "",
}) => {
  return (
    <div className={`${className} flex flex-col rounded gap-5`}>
      <div
        className={`${headerContainerClassName} flex items-center justify-between rounded gap-2.5`}
      >
        <span className="font-semibold text-xl">{header}</span>
        <div className="flex flex-wrap gap-2.5">{actionButtons}</div>
      </div>
      {isStatistics ? (
        <div className={`${statisticsClassName}`}>{statistics}</div>
      ) : null}
    </div>
  );
};

export default Header;
