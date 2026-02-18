
// Centralized storage for all course document links (Syllabi, Flyers, Applications)
// Keys are either SLN (for specific scheduled sections) or descriptive IDs (for catalog entries)

export const COURSE_LINKS: Record<string, string> = {
  // --- Spring 2026 Scheduled Courses (Key = SLN) ---
  "10151": "/flyers/ACCTG_579_Sustainability.pdf",
  "17122": "/syllabi/MKTG_511_B2B.pdf",
  "10847": "/syllabi/BECON_526_Global_Economy.pdf",
  "17050": "/syllabi/MGMT_547_Negotiations.pdf",
  "17124": "/syllabi/MKTG_535_Analytics_Lab.pdf",
  "17044": "/syllabi/MGMT_509_Global_Strategy.pdf",
  "17132": "/syllabi/MKTG_568_Pricing.pdf",
  "14536": "/syllabi/FIN_579_International_Finance.pdf",
  "17128": "/syllabi/MKTG_560_Consumer_Insights.pdf",
  "10140": "https://uwnetid.sharepoint.com/:b:/r/sites/foster_mba_students/Shared%20Documents/Syllabi-%20Electives/ACCTG510_SPR2025.pdf?csf=1&web=1&e=u1NLpa",
  "14065": "/syllabi/ENTRE_FIN_557_Entrepreneurial_Finance.pdf",
  "21090": "/flyers/FIN_579_Climate_Risk.pdf",
  "17048": "/syllabi/MGMT_545_High_Performance.pdf",
  "15172": "/syllabi/IBUS_500_Global_Business_Forum.pdf",
  "17053": "/flyers/MGMT_550_CEO_Board.pdf",
  "14534": "/syllabi/FIN_579_Endowment.pdf", // Mapped to Institutional Investment/Endowment
  "14074": "/syllabi/ENTRE_579_Biomedical.pdf",
  "14072": "/syllabi/ENTRE_579_Pitch.pdf",
  "17046": "/syllabi/MGMT_509_Global_Strategy.pdf",
  "17126": "/syllabi/MKTG_556_Advertising.pdf",
  "10849": "/syllabi/BECON_546_Game_Theory.pdf",
  "14067": "/syllabi/ENTRE_FIN_557_Entrepreneurial_Finance.pdf",
  "14531": "/syllabi/FIN_566_Alternative_Investments.pdf",
  "17055": "/syllabi/MGMT_575_Women_Leadership.pdf",
  "17135": "/syllabi/MKTG_579_Culture_Sales.pdf", // Closest match to Go-to-Market or Consultative
  "21305": "/flyers/MKTG_565_LLMs.pdf",
  "14057": "/syllabi/ENTRE_509_Foundations.pdf",
  "14061": "/syllabi/ENTRE_541_Tech_Commercialization.pdf",
  "14529": "/syllabi/FIN_560_Investments.pdf",
  "17057": "/syllabi/MGMT_579_Innovation.pdf",
  "00000": "/syllabi/ENTRE_579_Angel_Investing.pdf", // Mock SLN for scheduled Angel Investing

  // --- Winter 2026 Scheduled Courses (Key = SLN) ---
  "11002": "/syllabi/FIN_553_Banking.pdf",
  "11003": "/syllabi/MKTG_552_Consumer_Marketing.pdf",
  "11004": "/syllabi/OPMGT_550_Project_Management.pdf",
  "11007": "/syllabi/ENTRE_510_Ent_Strategy.pdf",

  // --- Autumn 2025 Scheduled Courses (Key = SLN) ---
  "12005": "/syllabi/ENTRE_509_Foundations.pdf",

  // --- Catalog / Unscheduled Courses (Key = Descriptive ID) ---
  // Page 1
  "ACCTG_510": "https://uwnetid.sharepoint.com/:b:/r/sites/foster_mba_students/Shared%20Documents/Syllabi-%20Electives/ACCTG510_SPR2025.pdf?csf=1&web=1&e=u1NLpa",
  "ACCTG_579_Alphanomics": "/syllabi/ACCTG_579_Alphanomics.pdf",
  "ACCTG_579_Sustainability": "/flyers/ACCTG_579_Sustainability.pdf", // Flyer
  "ACCTG_579_Race": "/syllabi/ACCTG_579_Race_Culture.pdf",
  "ACCTG_600": "/syllabi/ACCTG_600_Independent_Study.pdf",

  // Page 2
  "BA_560": "", // No link in PDF
  "BA_578": "/syllabi/BA_578_Impact_Investing.pdf",
  "BCMU_509": "/syllabi/BCMU_509_Finding_Voice.pdf",
  "BCMU_579_TED": "/syllabi/BCMU_579_TED_Talks.pdf",
  "BCMU_579_Interrupting": "/syllabi/BCMU_579_Interrupting_Privilege.pdf",
  "BCMU_600": "/syllabi/BCMU_600.pdf",
  "BECON_526": "/syllabi/BECON_526_Global_Economy.pdf",
  "BECON_546": "/syllabi/BECON_546_Game_Theory.pdf",
  "BECON_560": "/syllabi/BECON_560_Research_Partners.pdf",
  "BECON_600": "/syllabi/BECON_600.pdf",
  "ENTRE_509": "/syllabi/ENTRE_509_Foundations.pdf",
  "ENTRE_510": "/syllabi/ENTRE_510_Entrepreneurial_Strategy.pdf",
  "ENTRE_522": "/syllabi/ENTRE_522_Innovation_Strategy.pdf",

  // Page 3
  "ENTRE_532": "/syllabi/ENTRE_532_Software_Entrepreneurship.pdf",
  "ENTRE_540": "/syllabi/ENTRE_540_Business_Plan.pdf",
  "ENTRE_541": "/syllabi/ENTRE_541_Technology_Commercialization.pdf",
  "ENTRE_542": "/syllabi/ENTRE_542_VC_Investment.pdf",
  "ENTRE_543": "/syllabi/ENTRE_543_Environmental_Innovation.pdf",
  "ENTRE_545": "/syllabi/ENTRE_545_Health_Innovation.pdf",
  "ENTRE_555": "/syllabi/ENTRE_555_Entrepreneurial_Marketing.pdf",
  "ENTRE_557": "/syllabi/ENTRE_557_Entrepreneurial_Finance.pdf",
  "ENTRE_579_Angel": "/syllabi/ENTRE_579_Angel_Investing.pdf",
  "ENTRE_579_Biomedical": "/syllabi/ENTRE_579_Biomedical_Entrepreneurship.pdf",
  "ENTRE_579_CDL": "/applications/ENTRE_579_CDL.pdf", // Application
  "ENTRE_579_Pitch": "/syllabi/ENTRE_579_Entrepreneurial_Influence.pdf",

  // Page 4
  "ENTRE_579_Grand": "/flyers/ENTRE_579_Grand_Challenges.pdf", // Flyer
  "ENTRE_579_Influencer": "/syllabi/ENTRE_579_Influencer_Marketing.pdf",
  "ENTRE_579_Intrapreneurship": "/syllabi/ENTRE_579_Intrapreneurship.pdf",
  "ENTRE_579_Women": "/syllabi/ENTRE_579_Women_Leadership.pdf",
  "ENTRE_600": "/syllabi/ENTRE_600.pdf",
  "FIN_530": "/flyers/FIN_530_Financial_Management_Banks.pdf", // Flyer
  "FIN_551": "/syllabi/FIN_551_Business_Finance.pdf",
  "FIN_553": "/syllabi/FIN_553_Capital_Investment.pdf",
  "FIN_558": "/syllabi/FIN_558_Mergers_Acquisitions.pdf",
  "FIN_560": "/syllabi/FIN_560_Investments.pdf",
  "FIN_561": "/syllabi/FIN_561_Financial_Futures.pdf",
  "FIN_566": "/syllabi/FIN_566_Alternative_Investments.pdf",
  "FIN_579_AI": "/flyers/FIN_579_AI_in_Business.pdf", // Flyer
  "FIN_579_Asian": "/syllabi/FIN_579_Asian_Capital_Markets.pdf",
  "FIN_579_Behavioral": "/syllabi/FIN_579_Behavioral_Finance.pdf",
  "FIN_579_Climate": "/flyers/FIN_579_Climate_Risk.pdf", // Flyer

  // Page 5
  "FIN_579_Institutional": "/syllabi/FIN_579_Institutional_Investment.pdf",
  "FIN_579_Compliance": "/syllabi/FIN_579_Intl_Business_Compliance.pdf",
  "FIN_579_IntlFinance": "/syllabi/FIN_579_International_Finance.pdf",
  "FIN_579_RealEstate": "/syllabi/FIN_579_Real_Estate_Finance.pdf",
  "FIN_579_ML": "/syllabi/FIN_579_Machine_Learning.pdf",
  "FIN_579_Access": "/syllabi/FIN_579_Power_of_Access.pdf",
  "FIN_600": "/syllabi/FIN_600.pdf",
  "IS_600": "/syllabi/IS_600.pdf",
  "IBUS_500": "/syllabi/IBUS_500_Global_Business_Forum.pdf",
  "IBUS_570": "/syllabi/IBUS_570_International_Study.pdf",
  "IBUS_579": "/syllabi/IBUS_579_Global_Consulting.pdf",
  "IBUS_600": "/syllabi/IBUS_600.pdf",
  "MGMT_509": "/syllabi/MGMT_509_Global_Environment.pdf",
  "MGMT_545": "/syllabi/MGMT_545_High_Performance.pdf",
  "MGMT_547": "/syllabi/MGMT_547_Successful_Negotiations.pdf",

  // Page 6
  "MGMT_548": "/syllabi/MGMT_548_Deal_Making.pdf",
  "MGMT_550": "/flyers/MGMT_550_CEO_Board_Governance.pdf", // Flyer
  "MGMT_555": "/syllabi/MGMT_555_Nonprofit_Board_Fellows.pdf",
  "MGMT_575": "/syllabi/MGMT_575_Women_in_Leadership.pdf",
  "MGMT_579_Equity": "/flyers/MGMT_579_Corporate_Equity.pdf", // Flyer
  "MGMT_579_Growth": "/syllabi/MGMT_579_Corporate_Growth.pdf",
  "MGMT_579_Social": "/syllabi/MGMT_579_Social_Impact.pdf",
  "MGMT_579_Human": "/flyers/MGMT_579_Human_Sustainability.pdf", // Flyer (PDF lists both, used Flyer)
  "MGMT_579_Innovation": "/syllabi/MGMT_579_Innovation_Strategy.pdf",
  "MGMT_579_Cultures": "/syllabi/MGMT_579_Leading_Across_Cultures.pdf",
  "MGMT_579_Mindful": "/syllabi/MGMT_579_Mindful_Decision_Making.pdf",
  "MGMT_579_ESG": "/syllabi/MGMT_579_ESG_in_Business.pdf",
  "MGMT_579_Power": "/syllabi/MGMT_579_Power_and_Status.pdf",
  "MGMT_600": "/syllabi/MGMT_600.pdf",

  // Page 7
  "MKTG_511": "/syllabi/MKTG_511_B2B_Marketing.pdf",
  "MKTG_535": "/syllabi/MKTG_535_Analytics_Consulting.pdf",
  "MKTG_552": "/syllabi/MKTG_552_Consumer_Marketing.pdf",
  "MKTG_554": "/syllabi/MKTG_554_Strategic_Product_Mgmt.pdf",
  "MKTG_556": "/syllabi/MKTG_556_Advertising_Promotion.pdf",
  "MKTG_560": "/syllabi/MKTG_560_Consumer_Insights.pdf",
  "MKTG_562": "/syllabi/MKTG_562_Customer_Analytics.pdf",
  "MKTG_564": "/syllabi/MKTG_564_Analytics_Marketing.pdf",
  "MKTG_565": "/flyers/MKTG_565_LLMs_Business.pdf", // Flyer
  "MKTG_566": "/syllabi/MKTG_566_Digital_Marketing.pdf",
  "MKTG_568": "/syllabi/MKTG_568_Pricing_Strategy.pdf",
  "MKTG_579_Storytelling": "/flyers/MKTG_579_Strategic_Storytelling.pdf", // Flyer
  "MKTG_579_Consultative": "/syllabi/MKTG_579_Consultative_Selling.pdf",
  "MKTG_579_GoToMarket": "/syllabi/MKTG_579_Go_To_Market.pdf",
  "MKTG_579_Pricing": "/syllabi/MKTG_579_Pricing_Principles.pdf",
  "MKTG_579_Sustainable": "/syllabi/MKTG_579_Sustainable_Company.pdf",

  // Page 8
  "MKTG_600": "/syllabi/MKTG_600.pdf",
  "OPMGT_530": "/syllabi/OPMGT_530_Risk.pdf",
  "OPMGT_540": "/syllabi/OPMGT_540_Sustainable_Supply_Chains.pdf",
  "OPMGT_550": "/syllabi/OPMGT_550_Project_Management.pdf",
  "OPMGT_560": "/syllabi/OPMGT_560_Supply_Chain_Mgmt.pdf",
  "OPMGT_565": "/syllabi/OPMGT_565_Business_Analytics.pdf",
  "OPMGT_600": "/syllabi/OPMGT_600.pdf",
  "QMETH_551": "/syllabi/QMETH_551_Modeling_Spreadsheets.pdf",
  "QMETH_600": "/syllabi/QMETH_600.pdf",
};
