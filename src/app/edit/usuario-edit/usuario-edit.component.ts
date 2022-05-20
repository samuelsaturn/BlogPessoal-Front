import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from 'src/app/model/Usuario';
import { AlertasService } from 'src/app/service/alertas.service';
import { AuthService } from 'src/app/service/auth.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-usuario-edit',
  templateUrl: './usuario-edit.component.html',
  styleUrls: ['./usuario-edit.component.css']
})
export class UsuarioEditComponent implements OnInit {

  usuario: Usuario = new Usuario()
  idUsuario: number
  confirmarSenha: string
  tipoUsuario: string
  


  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private alert: AlertasService,
  ) { }

  ngOnInit() {
    window.scroll(0,0)

    if(environment.token == ''){
      this.alert.showAlertInfo('Sua sessão expirou, faça o login novamente')
      this.router.navigate(['/entrar'])
    }
    this.idUsuario = this.route.snapshot.params['id']
    this.findByIdUsuario(this.idUsuario) 
  }

  confirmSenha(event: any) {
    this.confirmarSenha = event.target.value
  }

  tipoUser(event: any) {
    this.tipoUsuario = event.target.value
  }

  atualizar() {
    this.usuario.tipo = this.tipoUsuario


    if (this.usuario.senha != this.confirmarSenha) {
      this.alert.showAlertDanger("As senhas estão diferentes")

    } else {
      this.authService.atualizar(this.usuario).subscribe({
        next: (resp: Usuario) => {
          this.usuario = resp
          environment.nome = ""
          environment.foto = ""
          environment.senha = ""
          environment.biografia = ""
          environment.token = ""
          environment.id = 0
          this.router.navigate(["/entrar"])
          this.alert.showAlertSuccess("Usuario atualizado com sucesso!")
        },
        error: erro => {
          if (erro.status == 400) {
            this.alert.showAlertWarning("Favor preencher os campos caso queira atualizar.")
          }
        },
      });
    }
  }

  findByIdUsuario(id: number){
    this.authService.getByIdUsuario(id).subscribe((resp: Usuario) =>
    {
      this.usuario = resp
      this.usuario.senha = environment.senha
    })
  }
}
