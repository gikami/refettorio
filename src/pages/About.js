import React, { useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { Navigation, Pagination } from 'swiper'

SwiperCore.use([Navigation, Pagination])

const About = () => {

    useEffect(() => {
        document.title = "О нас"
    }, [])

    return (
        <main className='pt-4 pt-lg-5'>
            <section className="position-relative container mb-8">
                <div className='row row-cols-lg-2 mb-5'>
                    <div>
                        <h1 className="inner text-center text-md-start">«RefettoriO» — ваше маленькое путешествие в Италию.</h1>
                        <p className='fs-11 mb-3'>«RefettoriO», мы готовим традиционную итальянскую пиццу на тонком тесте с 2008 года, в 2022 мы провели Ребрендинг - сменили имя.</p>
                        <p className='fs-11 mb-3'>«RefettoriO» — это ваше маленькое и незабываемое путешествие в Италию. Место, где вы всегда сможете отвлечься от городской суеты, при этом находясь в историческом центре Казани. Наших посетителей приятно порадуют дружелюбная атмосфера, заботливое отношение персонала к каждому гостю, демократичные цены и широкий выбор блюд.</p>
                        <p className='fs-11 mb-3'>«RefettoriO» славится своей пиццей, которая готовится в дровяной печи в зале. Каждый гость может воочию увидеть процесс приготовления этого блюда. А большой ассортимент позволит всем насладиться «любимой пиццей»!</p>
                        <p className='fs-11 mb-3'>«RefettoriO» - попробуй Италию на вкус!</p>
                    </div>
                    <div>
                        <Swiper
                            loop={true}
                            slidesPerView={1}
                            modules={[Pagination]}
                            pagination={{ clickable: true }}
                            className="swiper-about"
                        >
                            <SwiperSlide>
                                <img src="/images/hall1.jpg" alt="RefettoriO" className="img-fluid" />
                            </SwiperSlide>
                            <SwiperSlide>
                                <img src="/images/hall2.jpg" alt="RefettoriO" className="img-fluid" />
                            </SwiperSlide>
                            <SwiperSlide>
                                <img src="/images/hall3.jpg" alt="RefettoriO" className="img-fluid" />
                            </SwiperSlide>
                            <SwiperSlide>
                                <img src="/images/hall4.jpg" alt="RefettoriO" className="img-fluid" />
                            </SwiperSlide>
                            <SwiperSlide>
                                <img src="/images/hall5.jpg" alt="RefettoriO" className="img-fluid" />
                            </SwiperSlide>
                            <SwiperSlide>
                                <img src="/images/hall6.jpg" alt="RefettoriO" className="img-fluid" />
                            </SwiperSlide>
                            <SwiperSlide>
                                <img src="/images/hall7.jpg" alt="RefettoriO" className="img-fluid" />
                            </SwiperSlide>
                            <SwiperSlide>
                                <img src="/images/hall8.jpg" alt="RefettoriO" className="img-fluid" />
                            </SwiperSlide>
                        </Swiper>
                        
                    </div>
                </div>
                <div className='row flex-md-row-reverse mb-5'>
                    <div className='col-md-8'>
                        <h2>Меню</h2>
                        <p className='fs-11 mb-3'>Приготовленные по итальянским рецептам паста, ризотто. Большой выбор салатов и мясных блюд, десерты на любой вкус и конечно же изысканная, аппетитная и ароматная итальянская пицца, приготовленная в дровяной печи.</p>
                        <p className='fs-11 mb-3'>Вкусная еда – не повод платить больше.</p>
                        <p className='fs-11 mb-3'>Доступные цены, отличная кухня и приятная атмосфера для утреннего завтрака, деловых встреч за бизнес-ланчем, а также посиделок с семьей и друзьями, для любой компании и по любому поводу.</p>
                    </div>
                    <div className='col-md-4'>
                        <img src="/images/about1.jpg" alt="Меню" className="img-fluid" />
                    </div>
                </div>
                <div className='row mb-5'>
                    <div className='col-md-8'>
                        <h2>Повара</h2>
                        <p className='fs-11 mb-3'>Наши повара с искренней любовью относятся к своему делу.</p>
                        <p className='fs-11 mb-3'>Каждый день замешивают тесто, распаляют печь до 400С и нарезают ингредиенты, чтобы радовать наших гостей вкусной едой, и гости возвращаются к нам со своими близкими и друзьями еще много раз!</p>
                    </div>
                    <div className='col-md-4'>
                        <img src="/images/about2.jpg" alt="Повара" className="img-fluid" />
                    </div>
                </div>
                <div className='row flex-md-row-reverse mb-5'>
                    <div className='col-md-8'>
                        <h2>Доставка</h2>
                        <p className='fs-11 mb-3'>Не располагаете свободным временем, чтобы посетить наше заведение и отведать ароматную пиццу и другие итальянские блюда!?</p>
                        <p className='fs-11 mb-3'>Звоните нам, и мы доставим ваш заказ домой или в офис.</p>
                        <p className='fs-11 mb-3'>Вы можете быть уверенны в том, что доставленная нашими курьерами еда всегда свежая и только что приготовленная.</p>
                    </div>
                    <div className='col-md-4'>
                        <img src="/images/about3.jpg" alt="Доставка" className="img-fluid" />
                    </div>
                </div>
                <div className='row'>
                    <div className='col-md-8'>
                        <h2>Опыт</h2>
                        <p className='fs-11 mb-3'>У нас накопился огромный опыт, наши повара работают у нас более 13лет.</p>
                        <p className='fs-11 mb-3'>Мы дорожим своей репутацией и каждым клиентом. Каждую пиццу мы делаем вручную, начиная с момента приготовления теста и заканчивая контролем качества выпечки.</p>
                        <p className='fs-11 mb-3'>Для приготовления итальянской пиццы мы используем дровяную печь и живой огонь. Так готовится традиционная итальянская пицца на тонком тесте.</p>
                    </div>
                    <div className='col-md-4'>
                        <img src="/images/about4.jpg" alt="Опыт" className="img-fluid" />
                    </div>
                </div>
            </section>
        </main >
    );
};

export default About;
