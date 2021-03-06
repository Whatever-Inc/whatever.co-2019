var React = require('react')
var Router = require('react-router');
var {Navigation} = Router;
var $ = require('jquery')
var MobileDetect = require('mobile-detect')
var isMobile = !!new MobileDetect(navigator.userAgent).phone()
var moment = require('moment')
moment.locale('en')

var Lang = require('./Lang')
var Link = require('./Link')

module.exports = React.createClass({

    mixins: [Lang, Navigation],

    data: {
        en: {
            text_pc: 'Creative agencies PARTY New York and PARTY Taipei<br />have merged with Japan’s renowned digital production company dot by dot<br />to form a new global studio.',
            text_sp: 'Creative agencies PARTY New York and PARTY Taipei<br />have merged with Japan’s renowned<br />digital production company dot by dot<br />to form a new global studio.',
            image_pc: '/assets/statement-en.svg',
            image_sp: '/assets/statement-en-sp.svg',
            alt: '“PARTY (New York & Taipei)” is a creative agency that loves to make weird and wonderful things with their own hands. “dot by dot” is a digital production company that loves to create new ideas and strategies using their own brains.  Descriptions aside, the two teams share one similarity: Before anything else, we are creatives who “think and make”, because we believe that\'s the only way to bring dreamlike ideas to life.Many agencies and production companies around the world share the same mission of "thinking and making", but only few have walked the talk.Our challenge is to prove to the world that we can make whatever we imagine through our Tokyo, New York, Berlin, and Taipei teams.',
            titles: ['Chief Executive Officer', 'Chief Creative Officer', 'Chief Technology Officer'],
            names: ['Yusuke Tominaga', 'Masashi Kawamura', 'Saqoosha']
        },
        ja: {
            text_pc: 'dot by dot 、PARTY New York 、PARTY Taipei はこのたび合併し、<br />1つの新しい組織として「Whatever」をスタートします',
            text_sp: 'dot by dot 、PARTY New York 、PARTY Taipei は<br />このたび合併し、1つの新しい組織として<br />「Whatever」をスタートします',
            image_pc: '/assets/statement-ja.svg',
            image_sp: '/assets/statement-ja-sp.svg',
            alt: '自ら手を動かして作りたいクリエイティブエージェンシー“PARTY”と、自分たちの頭で考えたいプロダクション“dot by dot”。わたしたちに共通して言えるのは「考えて、作りたい」人の集まりだということ。なぜならそれこそが、夢のようなアイデアを夢のような形で実現できる唯一のつくり方だからです。これを標榜しているエージェンシーやプロダクションはたくさん出現していますが、残念ながらこれを本当に実現できているチームは、世界を見渡してもまだほとんど存在しません。わたしたちは東京、ニューヨーク、台北、ベルリンを拠点として、日本のみならず世界をもフィールドと定め、「考えて作る」ことの力を実証していきたいと思っています。',
            titles: ['Chief Executive Officer', 'Chief Creative Officer', 'Chief Technology Officer'],
            names: ['富永 勇亮', '川村 真司', 'Saqoosha']
        },
        zh: {
            text_pc: 'dot by dot 、PARTY New York 、PARTY Taipei<br/>合併成立新公司「Whatever」',
            text_sp: 'dot by dot 、PARTY New York 、PARTY Taipei<br/>合併成立新公司「Whatever」',
            image_pc: '/assets/statement-zh.svg',
            image_sp: '/assets/statement-zh-sp.svg',
            alt: 'PARTY (New York & Taipei) 是熱愛動手打造奇特與美好事物的創意公司。dot by dot 是熱愛動腦發想創意、思考策略的數位製作公司。看似不同，實則極為相似：我們都是動腦想又動手做的創意人—相信只有如此才能實現天馬行空的點子。 全球有許多代理商和製作公司標榜相似的理念，但真正落實的僅有少數。我們的挑戰是向世界證明：透過東京、紐約、柏林、台北的專業團隊，我們有能力將任何想像化為現實。',
            titles: ['CEO 首席執行長', 'CCO 首席創意長', 'CTO 首席技術長'],
            names: ['富永 勇亮', '川村 真司', 'Saqoosha']
        },
    },

    getInitialState() {
        var state = this.data[this.context.lang] ? this.data[this.context.lang] : this.data['en']
        state.showreel = false
        state.work = []
        state.news = []
        return state
    },

    getFeaturedWork() {
        var data = {
            'filter[tag]': 'featured',
            'filter[posts_per_page]': 3,
            lang: this.context.lang,
            _wp_json_nonce: window.nonce
        }
        $.getJSON('/wp-json/posts', data).done((result) => {
            this.setState({work: result})
        })
    },

    getLatestNews() {
        var data = {
            page: 1,
            'filter[posts_per_page]': 3,
            'filter[category_name]': 'news',
            lang:  this.context.lang,
            _wp_json_nonce: window.nonce
        }
        return $.getJSON('/wp-json/posts', data).done(result => {
            this.setState({ news: result })
        });
    },

    componentDidMount() {
        this.refs.showreel.getDOMNode().addEventListener('click', this._onClickWatchReel)
        if (isMobile) {
            window.addEventListener('resize', this._adjustReelAreaSize)
            this._adjustReelAreaSize()
        }
        this.getFeaturedWork()
        this.getLatestNews()
    },

    componentWillUnmount() {
        this.refs.showreel.getDOMNode().removeEventListener('click', this._onClickWatchReel)
        if (isMobile) {
            window.removeEventListener('resize', this._adjustReelAreaSize)
            this._adjustReelAreaSize()
        }
    },

    _onClickWork(slug) {
        this.transitionTo(`${this.context.langPrefix}/post/${slug}/`);
    },

    _onClickWatchReel() {
        if (isMobile) {
            window.open('https://www.youtube.com/watch?v=rsBTSWTbH4I')
        } else {
            this.setState({showreel: true})
            this.refs.overlay.getDOMNode().addEventListener('click', this._onClickReelOverlay)
            window.addEventListener('resize', this._onResize)
            this._onResize()
        }
    },

    _onClickReelOverlay() {
        this.setState({showreel: false})
    },

    _onResize() {
        var overlay = this.refs.overlay.getDOMNode()
        var iframe = overlay.querySelector('iframe')
        if (overlay.clientWidth / overlay.clientHeight < 16 / 9) {
            iframe.style.width = `${window.innerWidth}px`
            iframe.style.height = `${window.innerWidth / 16 * 9}px`
        } else {
            iframe.style.width = `${window.innerHeight / 9 * 16}px`
            iframe.style.height = `${window.innerHeight}px`
        }
    },

    _adjustReelAreaSize() {
        var container = this.refs.showreel.getDOMNode()
        var w = container.clientWidth
        var h = container.clientHeight
        var video = this.refs.showreelvideo.getDOMNode().querySelector('video')
        video.style.marginLeft = `${(w - h * (1280 / 720)) / 2}px`
        var button = this.refs.showreelbutton.getDOMNode()
        button.style.marginLeft = `${(w - h * (1280 / 720)) / 2}px`
    },

    render() {
        return <div className="statement">
            <div id="showreel" ref="showreel">
                <div ref="showreelvideo" dangerouslySetInnerHTML={{ __html: `
                    <video muted autoPlay playsinline loop src="${ isMobile ? "/assets/reel-preview.mp4" : "/assets/reel-preview.mp4"}" />
                ` }} />
                <img src="/assets/showreel-button.png" ref="showreelbutton"></img>
            </div>
            <img id="makewe" src={isMobile ? "/assets/makewhatever-sp.png" : "/assets/makewhatever.png"} />
            <div id="about"><Link to="/about/">ABOUT</Link></div>
            <div id="vline"></div>
            <div id="featured-work">
                <img src="/assets/featured-work.png" width="251"/>
                <div className="items">
                    {this.state.work.map(entry=> {
                        var style = { backgroundImage: entry.featured_image ? `url(${entry.featured_image.source})` : '' }
                        return <div key={entry.slug} className="work" style={style} onClick={this._onClickWork.bind(this, entry.slug)}>
                            <div className="title" dangerouslySetInnerHTML={{__html: entry.title}}></div>
                            <img src={isMobile ? "/assets/learnmore-sp.png" : "/assets/learnmore.png"} width="160"></img>
                        </div>
                    })}
                </div>
                <div id="allwork"><Link to="/work/">ALL WORK</Link></div>
            </div>
            <div id="news">
                <img src="/assets/news.png" width="84"/>
                <div className="items">
                    {this.state.news.map(entry=> {
                            var style = { backgroundImage: entry.featured_image ? `url(${entry.featured_image.source})` : '' }
                            var link = `${this.context.langPrefix}/post/${entry.slug}/`
                            return <div key={entry.slug} className="news" style={style} onClick={this._onClickWork.bind(this, entry.slug)}>
                                <div className="date">{moment(entry.date_gmt).format('LL')}</div>
                                <div className="title"><Link to={link} dangerouslySetInnerHTML={{__html: entry.title}}></Link></div>
                            </div>
                        })}
                </div>
                <div id="allnews"><Link to="/news/">ALL NEWS</Link></div>
            </div>
            { this.state.showreel ? <div id="showreel-overlay" ref="overlay">
                <iframe src="https://www.youtube.com/embed/rsBTSWTbH4I?rel=0;controls=0;modestbranding=0;autoplay=1" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                <button ref="close"><img src="/assets/close.png"/></button>
            </div> : null }
        </div>
    }
})
