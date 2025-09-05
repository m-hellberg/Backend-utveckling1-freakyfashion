import "./AboutUs.css";

const AboutUs = () => {
  return (
    <div className="about-us">
      <section className="about-us-hero">
        <img
          src="/images/about-us-hero.png"
          alt="Om oss"
          className="about-us-hero-image"
        />
        <div className="hero-text">
          <h1>Om oss</h1>
        </div>
      </section>

      <section className="about-us-content">
        <div className="content-wrapper">
          <h2>Vår historia</h2>
          <p>
            Freakyfashion föddes ur en enkel, men kraftfull idé: att kläder inte
            bara ska vara något man bär, utan ett sätt att uttrycka sin
            personlighet och sina drömmar. Företaget grundades 2017 av en grupp
            passionerade individer som alla delade en gemensam vision – att
            skapa en plats där modet inte skulle vara begränsat av konventioner,
            utan istället hylla det okonventionella och kreativa.
          </p>
          <p>
            Freakyfashion började som en liten, lokal butik i hjärtat av
            Stockholm, men drömmen var större än så. Vi ville att alla, var de
            än befann sig i världen, skulle kunna hitta kläder som kändes både
            inspirerande och uttrycksfulla. Med tiden, och genom vårt engagemang
            för kvalitet, design och kreativitet, har vi växt till en
            internationell e-handelsplattform som nu levererar våra galna,
            färgglada och unika plagg till kunder över hela världen.
          </p>
          <p>
            Från det ögonblick vi öppnade våra dörrar, har vi arbetat hårt för
            att ge våra kunder en upplevelse där modet är lika mycket en
            livsstil som en garderob. Idag finns vi i över 15 länder och är
            stolta över att kunna vara en ledande aktör inom alternativa kläder,
            alltid med ett öga på framtiden och ett hjärta som slår för det
            kreativa modet.
          </p>
          <p>
            Vi tror på att alla människor har rätt att uttrycka sig själva
            fritt, och vi är här för att hjälpa dig att göra just det. Här på
            Freakyfashion handlar det inte bara om att köpa kläder – det handlar
            om att vara den bästa versionen av dig själv och våga vara
            annorlunda, varje dag. Våra kläder är till för dem som vill sticka
            ut, både i färg och i stil. Så gå ut och erövra världen – klä dig
            för att vara unik, klä dig för att vara{" "}
            <strong>Freakyfashion</strong>.
          </p>
          <p>
            Vi är stolta över att vara en del av din resa och ser fram emot att
            fortsätta leverera kläder som gör skillnad för varje individ.
          </p>
        </div>
      </section>

      {/* Videos sektionen */}
      <section className="about-us-video">
        <h3>Vad är Freakyfashion?</h3>
        <video controls className="about-us-video-player">
          <source src="/videos/introduction.mp4" type="video/mp4" />
          Din webbläsare stödjer tyvärr inte videouppspelning.
        </video>
      </section>

      <section className="employee-videos">
        <h3>Hör vad några av våra medarbetare i Berlin tycker!</h3>
        <p>
          Vår globala familj består av mer än 200 passionerade medarbetare från
          olika delar av världen, alla eniga i sitt engagemang för vår vision
          och vårt kreativa modetänk. Lär känna oss genom våra medarbetare och
          hör deras berättelser om vad det innebär att vara en del av
          Freakyfashion-familjen.
        </p>
        <div className="video-gallery">
          <div className="video-card">
            <video controls className="employee-video">
              <source src="/videos/employee1.mp4" type="video/mp4" />
              Din webbläsare stödjer tyvärr inte videouppspelning.
            </video>
            <div className="employee-info">
              <h4>ALEX</h4>
              <p>
                Vår marknadsföringsguru som alltid har koll på trender och nya
                idéer.
              </p>
            </div>
          </div>
          <div className="video-card">
            <video controls className="employee-video">
              <source src="/videos/employee2.mp4" type="video/mp4" />
              Din webbläsare stödjer tyvärr inte videouppspelning.
            </video>
            <div className="employee-info">
              <h4>LINA</h4>
              <p>
                Vår kundtjänststjärna, alltid redo att hjälpa och ge bästa
                service.
              </p>
            </div>
          </div>
          <div className="video-card">
            <video controls className="employee-video">
              <source src="/videos/employee3.mp4" type="video/mp4" />
              Din webbläsare stödjer tyvärr inte videouppspelning.
            </video>
            <div className="employee-info">
              <h4>MIA</h4>
              <p>
                Designexpert som älskar att skapa spännande och kreativa
                kollektioner.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="options">
        <div className="option-item">
          <a href="#">
            <img src="/images/jobba-hos-oss.png" alt="Jobba hos oss" />
            <h4>Jobba hos oss</h4>
          </a>
        </div>
        <div className="option-item">
          <a href="#">
            <div className="villkor-bg"></div>
            <h4>Villkor</h4>
          </a>
        </div>
        <div className="option-item">
          <a href="#">
            <img src="/images/var-verksamhet.png" alt="Vår verksamhet" />
            <h4>Vår verksamhet</h4>
          </a>
        </div>
        <div className="option-item">
          <a href="#">
            <img src="/images/kontakta-oss.png" alt="Kontakta oss" />
            <h4>Kontakta oss</h4>
          </a>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
