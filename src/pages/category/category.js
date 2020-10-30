import React from 'react'
import HTTP from '../../http.config'
import HomeStyle from '../home/home.less'
import cateStyle from './category.less'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {getProductsAction} from '../../store/actionCreate'
import loading_icon from '../../assets/images/imgs/loadding.gif'
import Stepper from '../../components/stepper/stepper.js'
class Category extends React.Component{
    constructor(){
        super()
        this.state={
            acMainId:1,
            acSubId:0,
            mainMenu:[],
            subMenu:[],
            isLoading:false,
            isFinish:false,
            page:1,
            showAllSublist:true
        }
        Category._this = this;
        this.productListRef = React.createRef()
    }
    componentDidMount(){
        let {state} = this.props.history.location
        let mainId = state ? state.mainId : 1
        console.log(mainId)
        this.setState({
            acMainId:mainId
        }, ()=>{
            this.props.getProducts()
            this.initMenu()
        })
    }
    //初始化主和附菜单
    initMenu=()=>{

        let getMainMenu = this.getMainMenu()
        let getSubMenu = this.getSubMenu()
        Promise.all([getMainMenu,getSubMenu]).then((res)=>{
            let item = {id:0 , title:'全部'}
            console.log(res)
            let mainMenu = res[0].data
            let subMenu = res[1].data
            subMenu.unshift(item)
            this.setState({
                mainMenu,
                subMenu,
                acSubId:0,
            })
        })

    }
    onScroll=()=>{
        let { isLoading,isFinish } = this.state;
        let scrollH = this.productListRef.current.scrollHeight;
        let clientH = this.productListRef.current.clientHeight;
        let scrollT = this.productListRef.current.scrollTop;
        let top = scrollH - clientH;
        if(scrollT+50 >top && !isLoading && !isFinish){
            this.setState({
                isLoading:true,
              })
            this.props.getProducts()
        }
    }
    //获取主菜单
    getMainMenu=()=>{
        let res =  HTTP.get('/api/cate/home_list')
        return res
    }
    //获取附菜单
    getSubMenu=()=>{
        let acMainId = this.state.acMainId;
        let res =  HTTP.post('/api/cate/sub_list',{pid:acMainId})
        return res
    }
    //改变主激活菜单
    changeActive(id){
        console.log(id)
        this.setState({
            acMainId:id,
            showAllSublist:true
        },()=>{
            this.getSubMenu().then((res)=>{
                let item = {id:0 , title:'全部'}
                let subMenu = res.data
                subMenu.unshift(item)
                this.setState({    
                    subMenu:res.data,
                    acSubId:0,
                    isLoading:false,
                    isFinish:false,
                    page:1
                },()=>{
                    this.props.getProducts()
                })
            })
        })
    }
    //改变附激活菜单
    changeSubActive(id){
        console.log(id)
        this.setState({
            acSubId:id,
            isLoading:false,
            isFinish:false,
            showAllSublist:false,
            page:1
        }, ()=>{
            this.props.getProducts()
        })
    }
    render(){
        return <div>
                <div className={HomeStyle.header}></div>
                <div className={cateStyle.wrap}>
                    <div className={cateStyle.main}>
                        <ul className={cateStyle.mainMenu}>{this.state.mainMenu.map(item => {
                        return <li className={item.id === this.state.acMainId ? cateStyle.active : null} 
                                key={item.id} onClick={this.changeActive.bind(this,item.id)}>
                                    {item.title}
                                </li>
                        })}</ul>
                        <div className={cateStyle.sublist}>
                            <div className={cateStyle.subnav}>
                                <ul>{this.state.subMenu.map(item => {
                                        return <li key={item.id}>
                                                    <span className={this.state.acSubId === item.id ? cateStyle.subac : null} 
                                                        onClick ={this.changeSubActive.bind(this,item.id)}>
                                                        {item.title}
                                                    </span>
                                                </li>
                                    })}
                                </ul>
                            </div>
                            <div className={cateStyle.product_list} onScroll={this.onScroll} ref={this.productListRef}>
                                <ul>
                                    {this.props.product_list.map(item=>{
                                        return <li key={item.id}>
                                            <div className={cateStyle.img}>{item.cover_url && <img src={item.cover_url} alt={item.description}/>}</div>
                                            <div className={cateStyle.context}>
                                                <div className={cateStyle.title}>{item.title}</div>
                                                <div className={cateStyle.price}>{item.price} <span>元/斤</span></div>
                                                <div className={cateStyle.stepper}><Stepper cartItem={item}/></div>
                                            </div>
                                        </li>
                                    })}
                                </ul>
                                {this.state.isLoading ?  <img className={cateStyle.loading_icon} src={loading_icon} alt="loading_icon" /> : null}
                                {this.state.isFinish ?  <div className={cateStyle.end}>----我是有底裤的----</div> : null}
                            </div>
                        </div>
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
        async getProducts(){
            let that = Category._this;
            let res;
            if(that.state.showAllSublist || (that.state.acSubId===0)){
                let pid = that.state.acMainId
                res = await HTTP.post('/api/products/main_list?page='+that.state.page,{pid})
                console.log(res)
            }
            else{
                let pid = that.state.acSubId
                res = await HTTP.post('/api/products/sub_list?page='+that.state.page,{pid})
                console.log(res)
            }
            console.log(that.state.showAllSublist,that.state.acSubId)
   
            that.setState({isLoading:true},async ()=>{
                let isFinish = res.current_page===res.last_page ? true : false
                let old_product_list= that.state.page===1 ? [] : that.props.product_list
                let new_product_list = [...old_product_list, ...res.data]
                let action = getProductsAction(new_product_list)
                dispatch(action)
                that.setState({
                    isLoading:false,
                    page:that.state.page+1,
                    isFinish
                })  
            })
        },
    }
}
export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Category))