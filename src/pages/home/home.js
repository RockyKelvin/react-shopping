import React from 'react'
import HTTP from '../../http.config'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import HomeStyle from './home.less'
import bannerImg from '../../assets/images/imgs/banner.jpg'
import nav_icon from '../../assets/images/imgs/nav_icon.jpg'
import loading_icon from '../../assets/images/imgs/loadding.gif'
import {getProductsAction} from '../../store/actionCreate'
class Home extends React.Component{
    constructor(){
        super()
        this.state={
            list:[],
            page:1,
            isLoading:false,
            isFinish:false,
        }
        Home._this = this;
        this.homeRef = React.createRef()
    }
    goToCatePage(pid){
        let { history } = this.props
        history.push('/category', {mainId:pid})
    }
    onScroll=()=>{
        let { isLoading,isFinish } = this.state;
        let scrollH = this.homeRef.current.scrollHeight;
        let clientH = this.homeRef.current.clientHeight;
        let scrollT = this.homeRef.current.scrollTop;
        let top = scrollH - clientH;
        if(scrollT+50 >top && !isLoading && !isFinish){
            this.setState({
                isLoading:true,
              })
            this.props.getProducts()
        }
    }
    async componentDidMount(){
       let nav_list = await HTTP.get('/api/cate/home_list') ;
       this.setState({
        list:nav_list.data,
      }) 
       this.props.initProducts()
        
    }
    render(){
        return <div >
            <div className={HomeStyle.header}></div>
            <div className={HomeStyle.wrap} onScroll={this.onScroll} ref={this.homeRef}>
                <div className={HomeStyle.banner}><img src={bannerImg} alt="banner"/></div>
                <div className={HomeStyle.navlist}><ul>{this.state.list.map(item=>{
                    return <li onClick={this.goToCatePage.bind(this,item.id)} key={item.id}><img src={nav_icon} alt="nav_icon"/><span>{item.title}</span></li>
                })}</ul></div>
                <div className={HomeStyle.products}>
                    <ul>{this.props.product_list.map(item=>{
                        return <li key={item.id}><img src={item.cover_url} alt="product_icon"/><span>{item.title}</span>
                            <i>{item.price} <span>元/斤</span></i>
                        </li>
                    })}</ul>
                {this.state.isLoading ?  <img className={HomeStyle.loading_icon} src={loading_icon} alt="loading_icon" /> : null}
                {this.state.isFinish ?  <div className={HomeStyle.end}>----我是有底裤的----</div> : null}
                </div>
            </div>
        </div>
    }
}
const mapStateToProps = (state)=>{
    return {
        product_list:state.product_list,
    }
}

// 把dispatch 方法映射到props属性上
const mapDispatchToProps = (dispatch)=>{
    return {
        async initProducts(){
            let that = Home._this;
            let page = that.state.page
            that.setState({isLoading:true,page},async ()=>{
                let res = await HTTP.post('/api/products/hot_list?page='+that.state.page)
                let product_list=[...res.data]
                let isFinish = res.current_page===res.last_page ? true : false
                let action = getProductsAction(product_list)
                dispatch(action)
                that.setState({
                    isLoading:false,
                    isFinish
                })
            })
        },
        getProducts(){
            let that = Home._this;
            let page = that.state.page+1;
            that.setState({isLoading:true,page},async ()=>{
                let res = await HTTP.post('/api/products/hot_list?page='+that.state.page)
                let product_list=[...that.props.product_list,...res.data]
                let isFinish = res.current_page===res.last_page ? true : false
                let action = getProductsAction(product_list)
                dispatch(action)
                that.setState({
                    isLoading:false,
                    isFinish
                })
            })
        },
    }
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Home));