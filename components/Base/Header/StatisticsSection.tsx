const StatisticSection = ({
  steps,
  stepCount = 4,
  className,
  statsFontSize,
  overflow,
  analytics = false,
  dropdown,
  setCurrencyValue,
  currencyData,
  updateCurrencyValue,
}) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const updateWindowSize = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", updateWindowSize);
    return () => {
      window.removeEventListener("resize", updateWindowSize);
    };
  }, [window.innerWidth]);

  const handleStatCount = useMemo(() => {
    if (windowWidth >= 1920) {
      return 6;
    } else if (windowWidth <= 1024) {
      return 2;
    } else {
      return stepCount;
    }
  }, [windowWidth]);

  const [statCount, setStatCount] = useState(0);
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(0);
  const [currentPageValue, setCurrentPageValue] = useState(1);
  const [numEachPage, setNumPage] = useState(0);

  const handleNext = () => {
    setMinValue(currentPageValue * numEachPage);
    setMaxValue(
      (currentPageValue + 1) * numEachPage <= steps.length
        ? (currentPageValue + 1) * numEachPage
        : steps.length,
    );
    setCurrentPageValue(currentPageValue + 1);
  };

  const handleBack = () => {
    setMinValue((currentPageValue - 2) * numEachPage);
    setMaxValue(
      (currentPageValue - 1) * numEachPage >= steps.length &&
        (currentPageValue - 2) * numEachPage >= steps.length - numEachPage
        ? steps.length
        : (currentPageValue - 1) * numEachPage,
    );
    setCurrentPageValue(currentPageValue - 1);
  };

  const [currency, setCurrency] = useState("");

  useEffect(() => {
    if (!currency) {
      setCurrency(currencyData && currencyData[0]?.value);
    } else if (updateCurrencyValue) {
      setCurrency(updateCurrencyValue);
    }
  }, [currencyData, currency, updateCurrencyValue]);

  const onChangeCurrency = (evt, selectedValue) => {
    setCurrency(selectedValue.value);
    setCurrencyValue(selectedValue.value);
  };

  useEffect(() => {
    setStatCount(handleStatCount);
    setMaxValue(handleStatCount);
    setMaxValue(handleStatCount);
    setNumPage(handleStatCount);
  }, [handleStatCount]);

  const convertToFirstCharacterCapital = (text) => {
    let [firstWord, ...rest] = text.toLowerCase().split(" ");
    return [
      firstWord.charAt(0).toUpperCase() + firstWord.slice(1),
      ...rest,
    ].join(" ");
  };

  return (
    <>
      <>
        {/* Mobile View */}
        <div className="mobile-view">
          <div className="flex gap-5 p-0">
            <div className="flex gap-5 whitespace-nowrap">
              {steps.map((step, index) => (
                <div
                  className="border-r border-[#e8e8e8] last:border-r-0"
                  key={index}
                >
                  <Stats
                    stats={step.stats ? step.stats : 0}
                    subStats={step.subStats}
                    icon={step.icon}
                    statIcon={step.statIcon}
                    percentage={step.percentage}
                    type={step.type}
                    tooltip={step.tooltip}
                    size={statsFontSize}
                  >
                    <>{convertToFirstCharacterCapital(step.children)}</>
                  </Stats>
                </div>
              ))}
            </div>
            {dropdown && (
              <div className="w-max">
                <Dropdown
                  className="toolbar-dropdown"
                  menuContainerStyle={{
                    position: "relative",
                  }}
                  options={currencyData}
                  placeHolder="Currency"
                  value={currency}
                  id="dd_currencytype_stat"
                  onSelect={(e, selectedValue) =>
                    onChangeCurrency(e, selectedValue)
                  }
                />
              </div>
            )}
          </div>
        </div>

        {/* Desktop View */}
        <div className="desktop-view">
          {analytics ? (
            <StatisticSectionContainer className={className}>
              <StatisticSectionWrapper>
                <PaperComponent className="paper-component">
                  {steps.map((step, index) => (
                    <Stats
                      key={index}
                      stats={step.stats}
                      subStats={step.subStats}
                      icon={step.icon}
                      statIcon={step.statIcon}
                      percentage={step.percentage}
                      type={step.type}
                      tooltip={step.tooltip}
                      size={statsFontSize}
                    >
                      {convertToFirstCharacterCapital(step.children)}
                    </Stats>
                  ))}
                </PaperComponent>
              </StatisticSectionWrapper>
            </StatisticSectionContainer>
          ) : (
            <StatisticSectionContainer className={className}>
              <StatisticSectionWrapper>
                <Paper overflow={overflow}>
                  {steps.slice(minValue, maxValue).map((step, index) => (
                    <Stats
                      key={index}
                      stats={step.stats}
                      subStats={step.subStats}
                      icon={step.icon}
                      statIcon={step.statIcon}
                      percentage={step.percentage}
                      type={step.type}
                      tooltip={step.tooltip}
                      size={statsFontSize}
                    >
                      <>{convertToFirstCharacterCapital(step.children)}</>
                    </Stats>
                  ))}
                </Paper>
                {dropdown ? (
                  <StepperDDContainer>
                    <Dropdown
                      className="!p-2 dd-stat-currency"
                      options={currencyData}
                      placeHolder="Currency"
                      value={currency}
                      id="dd_currencytype_stat"
                      onSelect={(e, selectedValue) =>
                        onChangeCurrency(e, selectedValue)
                      }
                    />
                    {steps.length > statCount && (
                      <MobileStepper
                        nextButton={
                          <div className="prev-next-btn">
                            <Button
                              color="secondary"
                              variant="outlined"
                              onClick={handleNext}
                              id="btnnext"
                              size="small"
                              disabled={
                                Math.ceil(steps.length / numEachPage) ===
                                currentPageValue
                              }
                            >
                              <ArrowRight />
                            </Button>
                          </div>
                        }
                        prevButton={
                          <div className="prev-next-btn prev-btn">
                            <Button
                              color="secondary"
                              variant="outlined"
                              onClick={handleBack}
                              id="btnprevious"
                              size="small"
                              disabled={currentPageValue === 1}
                            >
                              <ArrowRight />
                            </Button>
                          </div>
                        }
                      />
                    )}
                  </StepperDDContainer>
                ) : (
                  steps.length > statCount && (
                    <MobileStepper
                      nextButton={
                        <div className="prev-next-btn">
                          <Button
                            color="secondary"
                            variant="outlined"
                            onClick={handleNext}
                            id="btnnext"
                            size="small"
                            disabled={
                              Math.ceil(steps.length / numEachPage) ===
                              currentPageValue
                            }
                          >
                            <ArrowRight />
                          </Button>
                        </div>
                      }
                      prevButton={
                        <div className="prev-next-btn prev-btn">
                          <Button
                            color="secondary"
                            variant="outlined"
                            onClick={handleBack}
                            id="btnprevious"
                            size="small"
                            disabled={currentPageValue === 1}
                          >
                            <ArrowRight />
                          </Button>
                        </div>
                      }
                    />
                  )
                )}
              </StatisticSectionWrapper>
            </StatisticSectionContainer>
          )}
        </div>
      </>
    </>
  );
};
