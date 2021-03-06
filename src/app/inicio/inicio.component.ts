import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
import { Postagem } from '../model/Postagem';
import { Tema } from '../model/Tema';
import { Usuario } from '../model/Usuario';
import { AlertasService } from '../service/alertas.service';
import { AuthService } from '../service/auth.service';
import { PostagemService } from '../service/postagem.service';
import { TemaService } from '../service/tema.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  nome = environment.nome
  foto = environment.foto
  id = environment.id

  postagem: Postagem = new Postagem()
  listaPostagens: Postagem[]
  tituloPost: string

  tema: Tema = new Tema()
  listaTemas: Tema[]
  idTema: number
  descricaoTema: string

  usuario: Usuario = new Usuario()
  idUsuario = environment.id

  contador = String

  key = 'data'
  reverse = true


  constructor(
    public route: Router,
    private postagemService: PostagemService,
    private temaService: TemaService,
    private authService: AuthService,
    private alert: AlertasService,
  ) { }

  ngOnInit() {
    window.scroll(0, 0)

    if (environment.token == '') {
      this.alert.showAlertInfo('Sua sessão expirou, faça o login novamente')
      this.route.navigate(['/entrar'])
    }
    this.getAllTemas();
    this.getAllPostagens();
    this.authService.refreshToken();
    this.temaService.refreshToken();
    this.findByIdUsuario();

    if(this.foto === null){
      this.foto = "https://static.vecteezy.com/ti/vetor-gratis/p1/1991212-avatar-perfil-rosa-neon-icon-brick-wall-background-color-neon-vector-icon-vetor.jpg"
    }

    console.log(environment.foto)
  }

  findByIdUsuario() {
    this.authService.getByIdUsuario(this.idUsuario).subscribe((resp: Usuario) => {
      this.usuario = resp
    })
  }

  getAllTemas() {
    this.temaService.getAllTema().subscribe((resp: Tema[]) => {
      this.listaTemas = resp
    })
  }

  findAllTemas(){
    this.temaService.getAllTema().subscribe((resp: Tema[]) => {
      this.listaTemas = resp
    })
  }

  findByIdTema() {
    this.temaService.getByIdTema(this.idTema).subscribe((resp: Tema) => {
      this.tema = resp
    })
  }

  getAllPostagens() {
    this.postagemService.getAllPostagens().subscribe((resp: Postagem[]) => {
      this.listaPostagens = resp
    })
  }

  publicar() {
    this.tema.id = this.idTema
    this.postagem.tema = this.tema

    this.usuario.id = this.idUsuario
    this.postagem.usuario = this.usuario

    this.postagemService.postPostagem(this.postagem).subscribe((resp: Postagem) => {
      this.postagem = resp
      this.alert.showAlertSuccess("Postagem realizada com sucesso!");
      this.getAllPostagens();
      this.getAllTemas();
      this.findByIdUsuario();
      this.postagem = new Postagem();
    })
  }

  findByTituloPostagem() {
    if (this.tituloPost == '') {
      this.getAllPostagens()
    } else {
      this.postagemService.getByTituloPostagem(this.tituloPost).subscribe((resp: Postagem[]) =>
        this.listaPostagens = resp)
    }
  }

  findByDescricaoTema() {
    if (this.descricaoTema == '') {
      this.findAllTemas()
    } else {
      this.temaService.getByNomeTema(this.descricaoTema).subscribe((resp: Tema[]) => {
        this.listaTemas = resp
      })
    }
  }
}
