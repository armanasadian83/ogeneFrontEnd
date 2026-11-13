import { useContext, useEffect } from "react";
import {
    FiArrowLeft,
    FiBarChart2,
    FiBookOpen,
    FiCheckCircle,
    FiCreditCard,
    FiEdit3,
    FiFileText,
    FiLayers,
} from "react-icons/fi";
import { TbAtom, TbBulb, TbDna2, TbFlask } from "react-icons/tb";
import { MyContext } from "../../App";
import { useLanguage } from "../../i18n/LanguageContext";
import { projectBenefits, projectSpecialties, projectText } from "./projectContent";
import ProjectRequestForm from "./ProjectRequestForm";
import "./projects.css";

const stages = [
    { title: ["ایده و پروپوزال", "Idea & proposal"], icon: TbBulb },
    { title: ["طراحی و آموزش", "Design & training"], icon: TbFlask },
    { title: ["تحلیل نتایج", "Results analysis"], icon: FiBarChart2 },
    { title: ["مقاله و دفاع", "Paper & defense"], icon: FiCheckCircle },
];
const benefitIcons = [TbAtom, FiEdit3, TbFlask, FiBarChart2, FiLayers, FiCreditCard];

function ProjectWorkflow() {
    const { t } = useLanguage();
    const nodes = [
        { name: "proposal", title: ["موضوع و پروپوزال", "Topic & proposal"], icon: FiEdit3 },
        { name: "research", title: ["طراحی پژوهش", "Research design"], icon: TbFlask },
        { name: "training", title: ["آموزش و اجرا", "Training & practice"], icon: FiBookOpen },
        { name: "analysis", title: ["تحلیل و مقاله", "Analysis & paper"], icon: FiBarChart2 },
    ];
    return (
        <div className="projWorkflow">
            <div className="projWorkflowDiagram" aria-hidden="true">
                <svg className="projWorkflowLines" viewBox="0 0 600 390" fill="none" preserveAspectRatio="none">
                    <path d="M300 190 C220 190 230 90 145 90" />
                    <path d="M300 190 C380 190 370 90 455 90" />
                    <path d="M300 200 C220 200 230 290 145 290" />
                    <path d="M300 200 C380 200 370 290 455 290" />
                    <path className="projFlowTrace" d="M145 90 C230 90 220 190 300 190 S370 290 455 290" />
                </svg>
                <div className="projIdea">
                    <TbBulb />
                    <strong>{t("ایده شما", "Your idea")}</strong>
                </div>
                {nodes.map(({ name, title, icon: Icon }) => (
                    <div className={`projWorkflowNode projWorkflowNode--${name}`} key={name}>
                        <Icon />
                        <span>{t(...title)}</span>
                    </div>
                ))}
            </div>
            <p className="projAvailability">
                <span aria-hidden="true" />
                {t("آماده شنیدن ایده شما هستیم", "Ready to hear your idea")}
            </p>
        </div>
    );
}

export default function Projects() {
    const { t, dir, formatNumber } = useLanguage();
    const { setIsShowNavbar, setIsShowFooter, setIsShowCalenderBar, setIsBaleIconShown } =
        useContext(MyContext);

    useEffect(() => {
        setIsShowNavbar(true);
        setIsShowFooter(true);
        setIsShowCalenderBar(true);
        setIsBaleIconShown(false);
        window.scrollTo(0, 0);
        return () => {
            setIsShowCalenderBar(true);
            setIsBaleIconShown(true);
        };
    }, [setIsShowNavbar, setIsShowFooter, setIsShowCalenderBar, setIsBaleIconShown]);

    return (
        <main className="projectsPage" dir={dir}>
            <div className="projContainer">
                <section className="projHero" aria-labelledby="projects-title">
                    <div className="projHeroCopy">
                        <h1 id="projects-title">{t(...projectText.title)}</h1>
                        <p>{t(...projectText.intro)}</p>
                        <a className="projPrimaryButton" href="#project-request">
                            <span>{t("ثبت درخواست پروژه", "Submit a project request")}</span>
                            <FiArrowLeft aria-hidden="true" />
                        </a>
                        <p className="projAudience">
                            {t(
                                "همراه دانشگاه‌ها، دانشکده‌ها، دانشجویان، شرکت‌ها و مؤسسات",
                                "Working with universities, colleges, students, companies and institutes",
                            )}
                        </p>
                    </div>
                    <ProjectWorkflow />
                </section>

                <section className="projJourney projSection" aria-labelledby="project-journey-title">
                    <div className="projSectionHeading">
                        <h2 id="project-journey-title">
                            {t("مسیر پژوهش، با همراهی تخصصی", "Specialist support throughout your research")}
                        </h2>
                    </div>
                    <p className="projSectionLead">{t(...projectText.journey)}</p>
                    <ol className="projStages">
                        {stages.map(({ title, icon: Icon }, index) => (
                            <li className="projStage" key={title[1]}>
                                <span className="projStageNumber">
                                    {formatNumber(index + 1, { minimumIntegerDigits: 2 })}
                                </span>
                                <Icon aria-hidden="true" />
                                <h3>{t(...title)}</h3>
                            </li>
                        ))}
                    </ol>
                </section>

                <section className="projBenefits projSection" aria-labelledby="project-benefits-title">
                    <div className="projSectionHeading">
                        <h2 id="project-benefits-title">
                            {t("چرا نانوزیست‌فناوری اوژن؟", "Why Ogene Nanobiotechnology?")}
                        </h2>
                    </div>
                    <ul className="projBenefitGrid">
                        {projectBenefits.map((benefit, index) => {
                            const Icon = benefitIcons[index];
                            return (
                                <li key={benefit[1]}>
                                    <span className="projBenefitIcon">
                                        <Icon aria-hidden="true" />
                                    </span>
                                    <p>{t(...benefit)}</p>
                                </li>
                            );
                        })}
                    </ul>
                </section>

                <section className="projSpecialties projSection" aria-labelledby="project-specialties-title">
                    <div className="projSectionHeading">
                        <h2 id="project-specialties-title">{t("حوزه‌های تخصصی", "Our specialist fields")}</h2>
                    </div>
                    <p className="projSectionLead">{t(...projectText.fields)}</p>
                    <ul className="projSpecialtyList">
                        {projectSpecialties.map((specialty) => (
                            <li key={specialty[1]}>{t(...specialty)}</li>
                        ))}
                    </ul>
                </section>

                <div className="projMission">
                    <TbDna2 aria-hidden="true" />
                    <p>{t(...projectText.mission)}</p>
                </div>

                <section
                    className="projRequestSection"
                    id="project-request"
                    aria-labelledby="project-request-title"
                >
                    <div className="projRequestIntro">
                        <div className="projRequestIllustration" aria-hidden="true">
                            <FiFileText />
                            <TbDna2 />
                            <TbFlask />
                        </div>
                        <h2 id="project-request-title">
                            {t("ایده‌تان را با ما در میان بگذارید", "Tell us about your idea")}
                        </h2>
                        <p>{t(...projectText.closing)}</p>
                        <p className="projRequestNote">
                            {t(
                                "پس از ثبت درخواست، اطلاعات شما برای بررسی در اختیار تیم اوژن قرار می‌گیرد.",
                                "Once submitted, your request will be available to the Ogene team for review.",
                            )}
                        </p>
                    </div>
                    <ProjectRequestForm />
                </section>
            </div>
        </main>
    );
}
