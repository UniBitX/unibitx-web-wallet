import { Component, OnInit } from '@angular/core';
import { DataService } from '../providers/data.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Utilities } from '../utilities';
import { AccountService } from '../providers/account.service';
import { Router, ParamMap, ActivatedRoute } from '@angular/router';
import { PreparedTransaction, Transaction } from 'shared/types';
import { AuthService } from '../providers/auth.service';

@Component({
  selector: 'app-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.scss']
})
export class SendComponent implements OnInit {
  errorMessage: string | undefined;
  form: FormGroup;
  amountAtomic: number | undefined;
  fee: number | undefined;
  total: number | undefined;
  busy = false;
  waitForPin = false;
  preparedTx: PreparedTransaction | undefined;
  transaction: Transaction | undefined;
  // state: 'prepare' | 'confirm' | 'pin' = 'prepare';


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private dataService: DataService,
    private accountService: AccountService) {

    this.form = new FormGroup({
      amount: new FormControl('', Validators.compose([
        Validators.required
      ])),
      sendAddress: new FormControl('', Validators.compose([
        Validators.required
      ]))
    });

    this.form.controls.amount.valueChanges.subscribe(v => {
      this.amountAtomic = Utilities.getAtomicUnits(v);
      this.calculateTotal();
    });
  }

  ngOnInit() {
    if (this.authService.walletUser && !this.authService.walletUser.hasPin) {
      this.router.navigateByUrl('settings/set-pin');
      return;
    }

    this.route.paramMap.subscribe(params => {
      const address = params.get('address');

      if (address) {
        this.form.controls.sendAddress.setValue(address);
      } else {
        this.form.controls.sendAddress.setValue('');
      }
    });
  }

  calculateTotal() {
    if (this.amountAtomic && this.fee) {
      this.total = this.amountAtomic + this.fee;
    } else {
      this.total = undefined;
    }
  }

  homeClick() {
    this.errorMessage = undefined;
    this.preparedTx   = undefined;
    this.transaction  = undefined;

    this.router.navigateByUrl('/');
  }

  async onPinEnterred(pin: string) {
    if (!this.preparedTx) {
      this.waitForPin = false;
      return;
    }

    this.busy = true;
    this.errorMessage = undefined;

    try {
      const verified = await this.authService.verifyPin(pin);

      if (verified) {
        this.transaction = await this.accountService.send(this.preparedTx.id, pin);
        this.preparedTx = undefined;
        this.waitForPin = false;
      } else {
        this.errorMessage = 'invalid pin';
      }
    } catch (error) {
      this.errorMessage = this.errorMessage = error.message;
      this.waitForPin = false;
      this.preparedTx = undefined;
    } finally {
      this.busy = false;
    }
  }

  onScanQrClick() {
    this.router.navigateByUrl('/scanner');
  }

  async onSubmit(data: any) {
    this.errorMessage = undefined;
    this.preparedTx = undefined;

    const amount: number = data.amount;
    const atomicUnits = Utilities.getAtomicUnits(amount);
    const sendAddress: string = data.sendAddress;

    if (!atomicUnits) {
      this.errorMessage = 'Invalid amount.';
      return;
    }

    const account = this.dataService.defaultAccount;

    if (!account) {
      this.errorMessage = 'invalid account.';
      return;
    }

    this.busy = true;

    try {
      this.preparedTx = await this.accountService.prepareSend(account.id, atomicUnits, sendAddress);
    } catch (error) {
      this.errorMessage = this.errorMessage = error.message;
    } finally {
      this.busy = false;
    }
  }

  onCancelClick() {
    this.errorMessage = undefined;
    this.preparedTx = undefined;
  }

  onSendClick() {
    this.errorMessage = undefined;

    const account = this.dataService.defaultAccount;

    if (!account) {
      this.errorMessage = 'invalid account';
      return;
    }

    if (!this.preparedTx) {
      this.errorMessage = 'invalid state!';
      return;
    }

    this.waitForPin = true;
  }
}
