// /* eslint-disable no-unused-vars */
import React,{ Component } from 'react';
import { getDatabase, ref, onValue, set,update} from "firebase/database";
import { DownloadOutlined,DollarCircleOutlined,PrinterFilled,CheckCircleOutlined,ScanOutlined,SendOutlined} from '@ant-design/icons';
import './App.css'
import  {Tabs, 
  Typography,
  Image, 
  Row,
  Col, 
  Form,
  Input, 
  Select,
  Button,
  Card,
  Modal,
  notification,
  Divider,
  Tag,
  Space,
  Table

} from 'antd'
// const fs = window.require('fs')
// const path = window.require('path')
// import {IpcRenderer} from 'electron'
import shortid from 'shortid'
import logo from "./logoword.png"
import back from "./back.jpg"
import nocam from "./nocam.jpg"
import QrReader from 'react-qr-reader-es6'
// import {logo} from '../public/logoword.png'
import { initializeApp } from 'firebase/app';
import QRCode from "react-qr-code";
import domtoimage from 'dom-to-image'

var FileSaver = require('file-saver');
const firebaseConfig = {
  apiKey: "AIzaSyAxtSBvzEFNj6GS9PmjdTJ0VNtMR0Qq4Qc",
  authDomain: "bpass-bbb85.firebaseapp.com",
  databaseURL: "https://bpass-bbb85-default-rtdb.firebaseio.com",
  projectId: "bpass-bbb85",
  storageBucket: "bpass-bbb85.appspot.com",
  messagingSenderId: "81081224714",
  appId: "1:81081224714:web:253239d6ae1f4bc0b719f3",
  measurementId: "G-ZP0JFBK6YP"
};
 const app = initializeApp(firebaseConfig);
const { TabPane } = Tabs;
const {Title,Text} = Typography;
const {Meta} = Card;
const db = getDatabase(app)
const title = <Image preview={false} width={100} src={logo}/>
const getter =ref(db,'client/')
// var node = document.getElementById('my-node');
const openNotification = (title,message) => {
  notification.open({
    duration: 4.5,
    message: title ,
    description:message
      ,
    icon: <CheckCircleOutlined color="green" />
  });
};

const columns = [
  {
    title: 'Names',
    key: 'names',
    render: (text, record) => (
      <Space size="middle">
        <a>{record.nom}</a>
        <a>{record.post_nom}</a>
      </Space>
    ),
  },
  {
    title: 'Montant',
    dataIndex: 'amount',
    key: 'amount',
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.amount - b.amount,
  },
  {
    title: 'Address',
    dataIndex: 'addresse',
    key: 'addresse',
  },
  {
    title: 'Genre',
    dataIndex: 'sex',
    key: 'sex',
  },
  {
    title: 'Institution',
    dataIndex: 'institution',
    key: 'institution',
  },
];
const columns2 = [
  {
    title: 'Names',
    key: 'names',
    render: (text, record) => (
      <Space size="middle">
        <a>{record.noms}</a>
      </Space>
    ),
  },
  {
    title: 'NUM2CARTE(N2C)',
    dataIndex: 'id',
    key: 'addresse',
  },
  {
    title: 'Montant',
    dataIndex: 'amount',
    key: 'amount',
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.amount - b.amount,
  }
];
let donnes
let donnes2

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {nom: '',sexe:'male',postNom:'',addresse:'',institution:'',vals:[],isModalVisible:false,
    title: '',message:'',sid:'000000',amount: 500,showFinder:false,showData:false,showRecords:false, showLogin:true, user: '',pwd: '',labe:false
  }

    this.handleName = this.handleName.bind(this);
    this.handlePname = this.handlePname.bind(this);
    this.handleSex = this.handleSex.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleInst = this.handleInst.bind(this);
    this.handlePwd = this.handlePwd.bind(this);
    this.handleUser = this.handleUser.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showModal = this.showModal.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleScanner = this.handleScanner.bind(this)
    this.handlePrint = this.handlePrint.bind(this)
    this.handleRePrint = this.handleRePrint.bind(this)
    this.handleID = this.handleID.bind(this)
    this.handleAmo = this.handleAmo.bind(this)
    this.handlePay = this.handlePay.bind(this)
    this.getData = this.getData.bind(this)
    this.getRecords = this.getRecords.bind(this)
    this.handleLogin = this.handleLogin.bind(this)
  this.refer = React.createRef<HTMLDivElement>(null)

  }

  handleName(e) {
    this.setState({nom: e.target.value});
  }
  handlePname(e) {
    this.setState({postNom: e.target.value});
  }
  handleSex(e) {
    this.setState({sexe: e.value});
  }
  handleAdd(e) {
    this.setState({addresse: e.target.value});
  }
  handleInst(e) {
    this.setState({institution: e.target.value});
  }  
  handleID(e) {
    this.setState({sid: e.target.value});
  }
  handlePwd(e) {
    this.setState({pwd: e.target.value});
  }  
  handleUser(e) {
    this.setState({user: e.target.value});
  }
  handleAmo(e) {
    this.setState({amount: e.target.value});
  }
   showModal = () => {
    this.setState({isModalVisible: true});
  };

   handleClose = () => {
    this.setState({isModalVisible: false});

  };
  handleScanner = () => {
    this.setState({showFinder: !this.state.showFinder});

  };
  handleErr(title,mess) {
    Modal.error({
      title:title,
      content: mess
    })
  }
  handleSucc(title,mess) {
    Modal.success({
      title:title,
      content: mess
    })
  }
  handleLogin(){    
    if((this.state.user === 'Admin') && (this.state.pwd === 'Admin'))
    {
      this.setState({labe: false})
      this.setState({showLogin : false})

    }else{
      this.setState({labe: true})
    }
  }
  handlePay() {
    let data 
    console.log(this.state.sid);
    onValue(ref(db, 'client/' + this.state.sid ),(snapshot) => {
       data = snapshot.val()

    })
   if(data){
   const amount = parseInt(this.state.amount) + data.amount
    update(ref(db, 'client/' + this.state.sid ), {
      amount: amount
    });
    openNotification(' Transaction effectuée avec succès',`Votre compte avec les noms ${data.nom} ${data.post_nom} a été crédité de la  somme de ${amount}.`)
  }

  };
  getRecords(){
    onValue(ref(db, 'recs/' ),(snapshot) => {
      const snap = snapshot.val()
      let val =[]
      for (let id in snap) {
          val.push(snap[id])
      }
      this.setState({ vals: val})
      console.log(this.state.vals);
     })
     donnes2 = this.state.vals

     if(donnes2){
      console.log(donnes2);
      this.setState({showData: false,showRecords: true}) 
    }
  }
  getData(){
    onValue(ref(db, 'client/' ),(snapshot) => {
      const snap = snapshot.val()
      let val =[]
      for (let id in snap) {
          val.push(snap[id])
      }
      this.setState({ vals: val})
      console.log(this.state.vals);
     })
     donnes = this.state.vals

     if(donnes){
      console.log(donnes);
      this.setState({showRecords: false,showData: true}) 
    }
  }
  handlePrint(event){
    console.log(this.state.sid);

    let id = this.state.sid
    if(id === '000000'){
      this.handleErr('Erreur de sauvegarde','Cette erreur s\'est produite car l\'enregistrement que vous souhaitez faire est invalid.')
    }else{
      domtoimage.toBlob(document.getElementById('idcard'))
      .then(function (blob) {
        FileSaver.saveAs(blob, `CARD[${id}].png`);
      });
    }
  }

  handleRePrint(){
    let i
    onValue(ref(db, 'client/' ),(snapshot) => {
     const data = snapshot.val()
     let found =0
     for( i in data){
      if((data[i].nom === this.state.nom) && (data[i].post_nom ===this.state.postNom)){
        found = 1
     console.log(i);
    break;
      }
     }
     if(found === 1){
      this.setState({sid: i})
       if(this.state.sid !== '000000')

      this.handleSucc('Données récupérées avec succès','Vos données ont été récupérées avec succès , pour imprimer votre carte veuillez vous rendre dans la section Enregistrement et imprimer votre carte.')
     } else if(found === 0){
      this.handleErr('Erreur de requête','Cette erreur s\'est produite car les noms fournis ne correspondent à aucun enregistrement dans notre base de données. Veuillez vérifier que vous avez écrit correctement les noms.')
     }
   })
  }
  handleSubmit(event) {
    // alert('A name was submitted: ' + this.state.sexe + this.state.nom + this.state.addresse+ this.state.institution+ this.state.postNom);
    onValue(getter, (snapshot) => {
    const snap = snapshot.val()
    let val =[]
    for (let id in snap) {
        val.push(snap[id])
    }
    this.setState({ vals: val})
    console.log(this.state.vals);
   })
   let found = 0
   for (let i in this.state.vals){
     console.log(i);
     console.log("this is" + this.state.vals[i].name);
   if((this.state.vals[i].nom === this.state.nom) && (this.state.vals[i].post_nom === this.state.postNom)){
      console.log('worked');
    found =1

      this.handleErr('Erreur de requête','Cette erreur s\'est produite car l\'enregistrement que vous souhaitez insérer est déjà dans la base de données')
    break;
   }
   }
   if(found === 0){
    this.setState({sid: shortid.generate()})
    set(ref(db, 'client/' + this.state.sid ), {
      nom: this.state.nom,
      post_nom: this.state.postNom,
      sex : this.state.sexe,
      addresse: this.state.addresse,
      institution: this.state.institution,
      amount: this.state.amount
    });
    // openNotification('Enregistré avec succès!','Le client a été enregistré avec succès et une carte a été générée dans le volet de droite. Pour imprimer cette carte, appuyez sur le bouton "Imprimmer".')
   }
  }

  handleScan = data => {
    if (data) {
     console.log(data);
     this.setState({sid: data})
  }
}
  handleError = err => {
    console.error(err)
  }

  // componentDidMount(){
  //   this.setState({showLogin : true})
  // }

  render(){
    return (
      <div >
<Tabs defaultActiveKey="1" type="card" tabBarExtraContent={title} >
    <TabPane tab="Enregistrement" key="1">
    <Row>
      <Col  span={12} style={{borderRight:'1px solid lightgrey'}}>
        <Title level={4} style={{textAlign:'center'}} >
          Identification du client</Title>
   {/* <Divider orientation="center" plain>
   Identification du client
  </Divider> */}
      <Form 
        preserve={false}
        onFinish={this.handleSubmit}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        layout="horizontal"
        >
        <Form.Item 
        label="Nom"
        name="Nom"
        rules={[
          {
            required: true,
            message: 'Veuillez insérer votre nom'
          }
        ]}
        >
          <Input value={this.state.nom} onChange={this.handleName} />
        </Form.Item>
        <Form.Item  
        label="Post-Nom"
        name="Post-Nom"
        rules={[
          {
            required: true,
            message: 'Veuillez insérer votre post-nom'
          }
        ]}>
          <Input value={this.state.postNom} onChange={this.handlePname} />
        </Form.Item>
        <Form.Item label="Sexe">
          <Select defaultValue={{value: 'Male'}} labelInValue onChange={this.handleSex} >
            <Select.Option value="Male">Masculin</Select.Option>
            <Select.Option value="Female">Feminin</Select.Option>
            <Select.Option value="Other">Autre</Select.Option>

          </Select>
        </Form.Item>
        <Form.Item  label="Addresse"
        name="Addresse"
        rules={[
          {
            required: true,
            message: 'Veuillez insérer votre addresse'
          }
        ]}>
          <Input value={this.state.addresse} onChange={this.handleAdd} />
        </Form.Item>
        <Form.Item label="Institution"
        name="Institution"
        rules={[
          {
            required: true,
            message: 'Veuillez insérer votre institution'
          }
        ]}>
          <Input value={this.state.institution} onChange={this.handleInst} />
        </Form.Item>
        {/* <Form.Item label=" ">
        <Button>Button</Button>
      </Form.Item> */}
            <Row style={{justifyContent:'space-around'}}>
      <Button htmlType='submit' icon={<DownloadOutlined key="download" />} size="large"  align="middle">Enregistrer</Button>
      <Button  icon={<PrinterFilled key="print" />} onClick={this.handlePrint} size="large" align="middle">Imprimer</Button>
      </Row>
      </Form>

        </Col>
        <Col style={{padding:'0 10px 0 10px'}} span={12}>

      <Card
      id='idcard'
    style={{ width: 300,textAlign:'center' }}
    title="CARTE D'ABONNEMENT"
    cover={<QRCode  value={this.state.sid} level='H' size={300} />}
    actions={[
    ]}
    >
          <Text style={{fontSize:'12px'}} >{"REPUBLIQUE DEMOCRATIC DU CONGO"}</Text><br/>
      <Text style={{fontSize:'12px'}} >{"Nord-Kivu/Ville de goma"}</Text><br/>
      <Text style={{fontSize:'12px'}} >{"Société provinciale de transport(SPT)"}</Text>
    <Meta
      description={"N2C: " +  this.state.sid }
      />
  </Card>

        </Col>

    </Row>
    </TabPane>
    <TabPane tab="Paiement et Verification" key="2" className="tab2">
      <Row>
    <Col  span={12}  >
    <Divider orientation="left">Paiement</Divider>
    <Form 
        preserve={false}
        onFinish={this.handlePay}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        layout='horizontal'
        >
        <Form.Item 
        label="NDC"
        name="NDC"
        rules={[
          {
            required: true,
            message: 'Veuillez insérer votre NDC'
          }
        ]}
        >
          <Input  value={this.state.sid}  onChange={this.handleID} />
          </Form.Item>
          <Form.Item
        label="Montant"
        name="Montant"
        rules={[
          {
            required: true,
            message: 'Veuillez insérer votre Montant'
          }
        ]}
        >
          <Input value={this.state.amount} onChange={this.handleAmo} />
          </Form.Item>
          <Row style={{justifyContent:'space-around'}}>
          <Button  icon={<ScanOutlined key="scan"/>} onClick={this.handleScanner} >Scanner</Button>
          <Button htmlType='submit'  icon={<DollarCircleOutlined key="pay"/>}  >Payer</Button>
         </Row>
          </Form>
        <Divider orientation="left">Régénérer la carte de bus</Divider> 
        <Form 
        preserve={false}
        onFinish={this.handleRePrint}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        layout='horizontal'
        >
      <Form.Item 
        label="Nom"
        name="Nom"
        rules={[
          {
            required: true,
            message: 'Veuillez insérer votre nom'
          }
        ]}
        >
          <Input value={this.state.nom} onChange={this.handleName} />
        </Form.Item>
        <Form.Item
        label="Post-Nom"
        name="Post-Nom"
        rules={[
          {
            required: true,
            message: 'Veuillez insérer votre post-nom'
          }
        ]}>
          <Input value={this.state.postNom} onChange={this.handlePname} />
        </Form.Item>
        <Row style={{justifyContent:'center',alignItems:'center'}}>
          <Button  icon={<SendOutlined key="send"/>} htmlType="submit" >Envoyer</Button>
        </Row>
                   </Form>
</Col>
<Col  span={12} >
        {/* <Divider orientation="left">Lecteur de code QR</Divider> ------------------------------------- */}
       {this.state.showFinder ? (

         <div>
        <QrReader
          delay={300}
          onError={this.handleError}
          onScan={this.handleScan}
          style={{ width: '100%' }}
          />
        <p>{'NDC: '+ this.state.sid}</p>
      </div>
        ) : (
          <Image preview={false} style={{width:'100%',height:'392px'}}  src={nocam}   />
           )
        }
      </Col>
      </Row>
    </TabPane>
    <TabPane tab="Rapports" key="3">
    <Row style={{justifyContent:'flex-start', padding:10}}>
      <Button onClick={this.getData} >Toutes les données</Button>
      <Button onClick={this.getRecords}>Toutes les entrées</Button>
      </Row>
      {this.state.showData ? (
        <Table size='small' pagination={{pageSize:9}}  scroll={{y:340}} sticky columns={columns} dataSource={donnes} />
) : (
  // <Table pagination={{pageSize:6}}   sticky columns={columns} dataSource={donnes} />
  console.log("not showing")
  )
}
{this.state.showRecords ? (
        <Table size='small' pagination={{pageSize:9}} scroll={{y:340}}  sticky columns={columns2} dataSource={donnes2} />
) : (
  // <Table pagination={{pageSize:6}}   sticky columns={columns} dataSource={donnes} />
  console.log("not showing")
  )
}
    </TabPane>

  </Tabs>


  <Modal
  title="Veuillez vous connecter d'abords"
  visible={this.state.showLogin}
  centered={true}
  closable={false}
  maskClosable={false}
  destroyOnClose={true}
  footer={null}
  onOk={this.handleLogin}
  >
    <Form
      name="basic"
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onFinish={this.handleLogin}
      // onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input value={this.state.user} onChange={this.handleUser} />

      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
                <Input.Password value={this.state.pwd} onChange={this.handlePwd} />


      </Form.Item>
      
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Login
        </Button>
        </Form.Item>
    </Form>
    {this.state.labe ? <Text style={{color:'red'}} >Vous avez entré un mauvais mot de passe, veuillez réessayer.</Text> : <Text></Text>}

  </Modal>
</div>
  );
}
}

