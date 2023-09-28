import matplotlib.pyplot as plt
import numpy as np

decay_factors = [0.1, 0.2, 0.5, 1, 2]
views_list = [10, 50, 100, 500]
time_range = np.linspace(0, 30, 500)  # 0 to 30 days

for decay_factor in decay_factors:
    plt.figure()
    plt.title(f"Decay Factor = {decay_factor}")
    plt.xlabel('Age in Days')
    plt.ylabel('Weight')
    for views in views_list:
        weight = np.exp(-decay_factor * time_range) * views
        plt.plot(time_range, weight, label=f"Views = {views}")

    plt.legend()
    plt.grid(True)
    plt.show()
