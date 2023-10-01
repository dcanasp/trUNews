import matplotlib.pyplot as plt
import numpy as np

# # Exponential Decay with Power Law
# weight_exp_pow = (views ** alpha) * np.exp(-decay_factor * ageInDays)

# # Sigmoid Decay
# weight_sigmoid = views / (1 + np.exp((time_range -sigmoind_midpoint) * decay_factor))



# for decay_factor in decay_factors:
#     for alpha in alpha_values:
#         plt.figure()
#         plt.title(f"Decay Factor = {decay_factor}, Alpha = {alpha}")
#         plt.xlabel('Age in Days')
#         plt.ylabel('Weight')

#         for views in views_list:
#             # weight = (views ** alpha) * np.exp(-decay_factor * time_range) #Exponential Decay with Power Law
#             weight = views * (1 + decay_factor * time_range) ** -alpha

#             plt.plot(time_range, weight, label=f"Views = {views}")

#         plt.legend()
#         plt.grid(True)
#     plt.show()
#sigmoin esta bien sexy
decay_factors = [0.6]
# decay_factors = [3,5,10,20] #son power law factores pero ajak
alpha_values = [ 1, 1.5]
sigmoind_midpoint = 4
views_list = [10, 50, 100, 500, 900,1500]
time_range = np.linspace(0, 15, 500)  #dias

for decay_factor in decay_factors:
    plt.figure()
    plt.title(f"Decay Factor = {decay_factor}")
    plt.xlabel('Age in Days')
    plt.ylabel('Weight')
    for views in views_list:
        # weight = np.exp(-decay_factor * time_range) * views # el que estoy usando
        # weight = 1/np.power(1+time_range,decay_factor) * views #el otro
        weight = (views +250) / (1 + np.exp(( sigmoind_midpoint -time_range ) * -decay_factor)) #sigmoind #hasta los 6 dias nadie pierde relevancia
        # weight = views * np.log(1 + decay_factor /time_range) #logaritmic decay


        plt.plot(time_range, weight, label=f"Views = {views}")

    plt.legend()
    plt.grid(True)
    plt.show()

