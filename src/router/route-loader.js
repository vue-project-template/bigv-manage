class RouteLoader {
  constructor() {

  }

  load(context) {
    let components = []

    context.keys().forEach(key => {
      let component = context(key).default
      if (/!(main|Main$)|(.*?(?=router))/.test(component.name)) { //组件名不以'main'或'Main'结尾且包含后缀'router'的组件视为路由组件
        let path = component.name.includes('home') ? '/' : component.name.match(/(.*?)[-_]?router/)[1]
        components.push({
          path, //截取类似'emaprouter','emap-router','emap_router'字符串中的'emap'
          component
        })
      }
    })

    return components
  }
}

export default RouteLoader