import ko from 'ko';

import { StorageResultType, Notification } from 'Common/Enums';
import { getNotification } from 'Common/Translator';

import PackageStore from 'Stores/Admin/Package';
import Remote from 'Remote/Admin/Fetch';

class PackagesAdminSettings {
	constructor() {
		this.packagesError = ko.observable('');

		this.packages = PackageStore.packages;
		this.packagesReal = PackageStore.packagesReal;
		this.packagesMainUpdatable = PackageStore.packagesMainUpdatable;

		this.packagesCurrent = ko.computed(() =>
			this.packages().filter(item => item && item.installed && !item.compare)
		);
		this.packagesAvailableForUpdate = ko.computed(() =>
			this.packages().filter(item => item && item.installed && !!item.compare)
		);
		this.packagesAvailableForInstallation = ko.computed(() =>
			this.packages().filter(item => item && !item.installed)
		);

		this.visibility = ko.computed(() => (PackageStore.packages.loading() ? 'visible' : 'hidden'));
	}

	onShow() {
		this.packagesError('');
	}

	onBuild() {
		rl.app.reloadPackagesList();
	}

	requestHelper(packageToRequest, install) {
		return (result, data) => {
			if (StorageResultType.Success !== result || !data || !data.Result) {
				if (data && data.ErrorCode) {
					this.packagesError(getNotification(data.ErrorCode));
				} else {
					this.packagesError(
						getNotification(install ? Notification.CantInstallPackage : Notification.CantDeletePackage)
					);
				}
			}

			this.packages().forEach(item => {
				if (item && packageToRequest && item.loading && item.loading() && packageToRequest.file === item.file) {
					packageToRequest.loading(false);
					item.loading(false);
				}
			});

			if (StorageResultType.Success === result && data && data.Result && data.Result.Reload) {
				location.reload();
			} else {
				rl.app.reloadPackagesList();
			}
		};
	}

	deletePackage(packageToDelete) {
		if (packageToDelete) {
			packageToDelete.loading(true);
			Remote.packageDelete(this.requestHelper(packageToDelete, false), packageToDelete);
		}
	}

	installPackage(packageToInstall) {
		if (packageToInstall) {
			packageToInstall.loading(true);
			Remote.packageInstall(this.requestHelper(packageToInstall, true), packageToInstall);
		}
	}
}

export { PackagesAdminSettings, PackagesAdminSettings as default };
